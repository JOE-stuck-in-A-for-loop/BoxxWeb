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
              // Add the uploaded asset to GrapesJS asset manager
              editor.AssetManager.add({ src: url, name: file.name, type: file.type });
              // Also add it as a modal asset (shows in the asset manager modal)
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

    // Remove the default "Export" button from the top bar
    editor.Panels.removeButton('options', 'export-template');

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