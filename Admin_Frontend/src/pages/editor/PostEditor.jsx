import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useI18n } from '../../i18n';
import { createBubble } from '../../api';
import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import 'grapesjs/dist/css/grapes.min.css';
import '../pages.css';
import './postEditor.css';

const API_BASE = '/api';
const DRAFT_KEY = 'boxx_editor_draft';

function PostEditor() {
  const do_navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { t } = useI18n();
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [title, setTitle] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const ALL_TAGS = ['程序', '金融', '英文', '自我'];

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // ── Draft save / restore ──
  const [draftStatus, setDraftStatus] = useState(''); // '' | 'saved' | 'restored'

  // Use refs to avoid stale closures in the interval
  const titleRef = useRef(title);
  titleRef.current = title;
  const tagsRef = useRef(selectedTags);
  tagsRef.current = selectedTags;
  const lastSavedRef = useRef('');

  function saveDraft() {
    try {
      const editor = editorInstance.current;
      if (!editor) return;
      const html = editor.getHtml();
      const css = editor.getCss();
      const state = JSON.stringify({
        title: titleRef.current,
        html,
        css,
        tags: tagsRef.current,
        savedAt: Date.now(),
      });
      if (state === lastSavedRef.current) return; // no change
      localStorage.setItem(DRAFT_KEY, state);
      lastSavedRef.current = state;
      setDraftStatus('saved');
    } catch (e) {
      // Silently ignore — draft save must never block editing
    }
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      setTitle(draft.title || '');
      setSelectedTags(draft.tags || []);
      const editor = editorInstance.current;
      if (editor && (draft.html || draft.css)) {
        editor.setComponents(draft.html || '');
        if (draft.css) editor.setStyle(draft.css);
      }
      setDraftStatus('restored');
    } catch (e) {
      localStorage.removeItem(DRAFT_KEY);
    }
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    lastSavedRef.current = '';
    setDraftStatus('');
  }

  // Auto-save draft every 5 seconds (once editor is initialized)
  useEffect(() => {
    const id = setInterval(saveDraft, 5000);
    return () => clearInterval(id);
  }, []);

  // Save draft when leaving the page
  useEffect(() => {
    return () => { saveDraft(); };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      do_navigate('/');
    }
  }, [loading, isAuthenticated, do_navigate]);

  // ── Upload file to backend server ──
  async function uploadFileToServer(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('boxx_token');
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Upload failed');
    }

    const data = await res.json();
    return data.url;
  }

  // ── Upload files and add to Asset Manager ──
  async function uploadFilesAndAddToAssets(editor, files) {
    for (const file of Array.from(files)) {
      try {
        const url = await uploadFileToServer(file);
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(file.name);
        editor.AssetManager.add({
          src: url,
          name: file.name,
          type: isVideo ? 'video' : 'image',
        });
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Upload failed: ' + err.message);
      }
    }
  }

  // ── Open Asset Manager to pick a source for the given component ──
  function openAssetPickerFor(editor, component) {
    const tag = component.get('tagName');
    const type = component.get('type');
    const isVideo = tag === 'video' || tag === 'VIDEO' || type === 'video';

    editor.AssetManager.open({
      types: ['image', 'video'],
      select(asset, complete) {
        const src = asset.get('src');
        if (!src) return;

        if (isVideo) {
          // For video: set model's src property (not HTML attribute)
          // ComponentVideo uses model.src for trait binding and HTML rendering
          component.set('src', src);
          component.set('provider', 'so');
          // Also set as HTML attribute for the <video> tag
          component.addAttributes({ src });
        } else {
          // For image: use addAttributes which sets the <img> src attribute
          component.addAttributes({ src });
        }
        if (complete) {
          editor.AssetManager.close();
          editor.select(component);
        }
      },
    });
  }

  // ── Initialize GrapesJS once ──
  useEffect(() => {
    if (editorInstance.current) return;

    const editor = grapesjs.init({
      container: '#gjs-editor',
      height: '100%',
      width: 'auto',
      storageManager: false,
      undoManager: { trackSelection: false },
      selectorManager: { componentFirst: true },
      plugins: [gjsBlocksBasic],
      pluginsOpts: {
        [gjsBlocksBasic]: {
          flexGrid: true,
          blocks: [
            'column1', 'column2', 'column3', 'column3-7',
            'text', 'link', 'image', 'video',
          ],
          category: 'Layout',
          stylePrefix: 'gjs-',
        },
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        ],
      },
      // ── Asset manager ──
      assetManager: {
        upload: false,          // We handle upload manually via our button
        autoAdd: true,
        assets: [],             // Start empty; assets added via upload
      },
      styleManager: {
        appendTo: '#gjs-style',
        sectors: [
          { name: 'Background', open: true, buildProps: ['background-color', 'background'] },
          { name: 'Typography', open: true, buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align', 'letter-spacing', 'text-shadow'] },
          { name: 'Border', open: true, buildProps: ['border-radius', 'border', 'border-color', 'border-style', 'border-width', 'box-shadow'] },
          { name: 'Dimension', open: true, buildProps: ['width', 'height', 'max-width', 'min-height', 'padding', 'margin'] },
          { name: 'Layout', open: true, buildProps: ['display', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'gap'] },
          { name: 'Extra', open: false, buildProps: ['opacity', 'z-index'] },
        ],
      },
      traitManager: {
        appendTo: '#gjs-traits',
      },
      blockManager: {
        appendTo: '#gjs-blocks',
      },
      panels: { defaults: [] },
    });

    // Remove default Export button
    editor.Panels.removeButton('options', 'export-template');

    // ── Image block (uses built-in ComponentImage) ──
    editor.BlockManager.remove('image');
    editor.BlockManager.add('image', {
      label: 'Image',
      category: 'Layout',
      select: true,
      activate: true,
      media: `<svg viewBox="0 0 24 24" style="width:32px;height:32px">
        <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
      </svg>`,
      content: { type: 'image' },
    });

    // ── Video block (uses built-in ComponentVideo with HTML5 provider) ──
    editor.BlockManager.remove('video');
    editor.BlockManager.add('video', {
      label: 'Video',
      category: 'Layout',
      select: true,
      // No activate: true — we handle it via component:mount
      media: `<svg viewBox="0 0 24 24" style="width:32px;height:32px">
        <path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />
      </svg>`,
      content: {
        type: 'video',
        provider: 'so',
        style: { height: '350px', width: '100%', 'max-width': '615px' },
      },
    });

    // ── On component mount: handle video and image source selection ──
    editor.on('component:mount', (component) => {
      const type = component.get('type');

      if (type === 'video') {
        // Video dropped → open asset picker
        setTimeout(() => openAssetPickerFor(editor, component), 100);
      }
    });

    // ── Double-click: change source for image/video ──
    editor.on('component:dblclick', (component) => {
      const tag = component.get('tagName');
      const type = component.get('type');
      if (tag === 'img' || type === 'image') {
        openAssetPickerFor(editor, component);
      } else if (tag === 'video' || tag === 'VIDEO' || type === 'video') {
        openAssetPickerFor(editor, component);
      }
    });

    // ── Upload Media button in blocks panel + drag-drop upload ──
    editor.on('load', () => {
      // Add "Upload Media" button
      const blocksPanel = document.getElementById('gjs-blocks');
      if (blocksPanel) {
        const header = document.createElement('div');
        header.className = 'gjs-blocks-header';
        header.innerHTML = `
          <div style="padding:10px;border-bottom:1px solid #e0e0e0;font-weight:600;font-size:13px;color:#555;">
            LAYOUT
          </div>
          <button id="gjs-upload-btn" style="
            width:calc(100% - 16px);margin:8px;padding:8px 12px;
            background:#1565c0;color:#fff;border:none;border-radius:6px;
            cursor:pointer;font-size:13px;font-weight:500;
          ">
            📁 Upload Media
          </button>
        `;
        blocksPanel.prepend(header);

        setTimeout(() => {
          const btn = document.getElementById('gjs-upload-btn');
          if (btn) {
            btn.onclick = () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*,video/*';
              input.multiple = true;
              input.onchange = async (e) => {
                await uploadFilesAndAddToAssets(editor, e.target.files);
                // Open Asset Manager so user can pick what they uploaded
                editor.AssetManager.open({ types: ['image', 'video'] });
              };
              input.click();
            };
          }
        }, 100);
      }

      // Enable drag-drop upload onto canvas
      const canvas = document.getElementById('gjs-editor');
      if (canvas) {
        canvas.addEventListener('dragover', (e) => e.preventDefault());
        canvas.addEventListener('drop', async (e) => {
          e.preventDefault();
          const files = e.dataTransfer?.files;
          if (files?.length) {
            await uploadFilesAndAddToAssets(editor, files);
            editor.AssetManager.open({ types: ['image', 'video'] });
          }
        });
      }
    });

    editorInstance.current = editor;
    editorRef.current = editor;

    // Restore draft if one exists
    restoreDraft();

    return () => {
      editor.destroy();
      editorInstance.current = null;
    };
  }, []);

  async function handlePublish() {
    if (!title.trim()) {
      alert('Please enter a title for your bubble.');
      return;
    }
    setPublishing(true);
    try {
      const editor = editorInstance.current;
      const html = editor.getHtml();
      const css = editor.getCss();
      const fullHtml = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}</body></html>`;
      await createBubble(title, fullHtml, selectedTags);
      clearDraft(); // Remove draft after successful publish
      do_navigate('/feed');
    } catch (err) {
      alert('Failed to publish: ' + (err.message || 'Unknown error'));
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>{t('guestInfo.form.loading')}</p>
      </div>
    );
  }

  return (
    <div className="editor-page">
      {/* Top bar */}
      <div className="editor-topbar">
        <button className="editor-back-btn" onClick={() => do_navigate('/feed')}>
          ← Back
        </button>
        <div className="editor-title-area">
          <input
            className="editor-title-input"
            type="text"
            placeholder="Enter bubble title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* Tag selector */}
        <div className="editor-tags-row">
          {ALL_TAGS.map((tag) => (
            <label key={tag} className={`editor-tag-label${selectedTags.includes(tag) ? ' active' : ''}`}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                style={{ display: 'none' }}
              />
              {t('tags.' + tag)}
            </label>
          ))}
        </div>
        <button
          className="editor-publish-btn"
          onClick={handlePublish}
          disabled={publishing}
        >
          {publishing ? 'Publishing...' : 'Publish Bubble'}
        </button>
        {draftStatus === 'saved' && (
          <span className="editor-draft-indicator">💾 {t('editor.draftSaved')}</span>
        )}
        {draftStatus === 'restored' && (
          <span className="editor-draft-indicator draft-restored">
            📄 {t('editor.draftRestored')}
            <button className="editor-discard-draft-btn" onClick={clearDraft}>
              ✕
            </button>
          </span>
        )}
      </div>

      {/* Main editor area */}
      <div className="editor-main">
        {/* Left: Block panel */}
        <div className="editor-blocks" id="gjs-blocks"></div>

        {/* Center: Canvas */}
        <div className="editor-canvas" id="gjs-editor"></div>

        {/* Right: Style manager + Traits */}
        <div className="editor-style" id="gjs-style">
          <div className="editor-style-handle">Style</div>
        </div>
        <div className="editor-traits" id="gjs-traits">
          <div className="editor-style-handle">Properties</div>
        </div>
      </div>
    </div>
  );
}

export default PostEditor;