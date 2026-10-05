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

function PostEditor() {
  const do_navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { t } = useI18n();
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [title, setTitle] = useState('');
  const [publishing, setPublishing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      do_navigate('/');
    }
  }, [loading, isAuthenticated, do_navigate]);

  // Upload file to backend
  async function uploadFile(file) {
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
    // Return absolute URL for GrapesJS
    return `http://localhost:8000${data.url}`;
  }

  // Initialize GrapesJS once
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
            'column1',
            'column2',
            'column3',
            'column3-7',
            'text',
            'link',
            'image',
            'video',
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
      // ── Asset manager with custom upload ──
      assetManager: {
        upload: true,
        autoAdd: true,
        uploadName: 'file',
        multiUpload: true,
        // Custom upload handler — uploads to our backend
        uploadFile: async function (e) {
          const files = e.dataTransfer
            ? e.dataTransfer.files
            : e.target && e.target.files
              ? e.target.files
              : [];

          for (const file of files) {
            try {
              const url = await uploadFile(file);
              editor.AssetManager.add({ src: url, name: file.name, type: file.type });
              editor.AssetManager.add(url);
            } catch (err) {
              console.error('Upload failed:', err);
              alert('Upload failed: ' + err.message);
            }
          }
        },
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
      blockManager: {
        appendTo: '#gjs-blocks',
      },
      panels: { defaults: [] },
    });

    // Remove the default "Export" button
    editor.Panels.removeButton('options', 'export-template');

    // ── Replace the default video block with a working one ──
    editor.BlockManager.remove('video');
    editor.BlockManager.add('video', {
      label: 'Video',
      category: 'Layout',
      select: true,
      media: `<svg viewBox="0 0 24 24" style="width:32px;height:32px">
        <path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />
      </svg>`,
      content: `<video controls style="width:100%;max-width:615px;height:auto" src="">
        <p>Your browser doesn't support HTML5 video.</p>
      </video>`,
    });

    // ── Replace the default image block — opens asset manager for upload ──
    editor.BlockManager.remove('image');
    editor.BlockManager.add('image', {
      label: 'Image',
      category: 'Layout',
      select: true,
      media: `<svg viewBox="0 0 24 24" style="width:32px;height:32px">
        <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
      </svg>`,
      content: `<img src="" style="max-width:100%;height:auto" />`,
    });

    editorInstance.current = editor;
    editorRef.current = editor;

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
      await createBubble(title, fullHtml);
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
        <button
          className="editor-publish-btn"
          onClick={handlePublish}
          disabled={publishing}
        >
          {publishing ? 'Publishing...' : 'Publish Bubble'}
        </button>
      </div>

      {/* Main editor area */}
      <div className="editor-main">
        {/* Left: Block panel */}
        <div className="editor-blocks" id="gjs-blocks"></div>

        {/* Center: Canvas */}
        <div className="editor-canvas" id="gjs-editor"></div>

        {/* Right: Style manager */}
        <div className="editor-style" id="gjs-style"></div>
      </div>
    </div>
  );
}

export default PostEditor;