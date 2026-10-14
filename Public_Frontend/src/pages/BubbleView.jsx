import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { getBubble } from '../api';
import './pages.css';

function BubbleView() {
    const { id } = useParams();
    const do_navigate = useNavigate();
    const { t } = useI18n();
    const [bubble, setBubble] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBubble(id)
            .then(setBubble)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="page-container">
                <p>{t('guestInfo.form.loading')}</p>
            </div>
        );
    }

    if (!bubble) {
        return (
            <div className="page-container">
                <button className="back-btn" onClick={() => do_navigate('/feed')}></button>
                <div className="page-card">
                    <h1>Not Found</h1>
                    <p className="page-placeholder">This bubble doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '80px 20px 40px' }}>
            <button className="back-btn" onClick={() => do_navigate('/feed')}></button>

            <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: 32, color: '#1a237e' }}>
                    {bubble.title}
                </h1>
                <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#888', marginBottom: 8 }}>
                    <span style={{ color: '#1565c0', fontWeight: 500 }}>{bubble.author_name}</span>
                    <span>{new Date(bubble.created_at).toLocaleDateString()}</span>
                </div>

                {/* Tags */}
                {bubble.tags && bubble.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                        {bubble.tags.map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    display: 'inline-block',
                                    padding: '3px 10px',
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    background: '#e3f2fd',
                                    color: '#1565c0',
                                }}
                            >
                                {t('tags.' + tag)}
                            </span>
                        ))}
                    </div>
                )}

                {/* Rendered bubble content */}
                <div
                    className="bubble-content"
                    style={{
                        background: '#fff',
                        borderRadius: 16,
                        padding: 32,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    }}
                    dangerouslySetInnerHTML={{ __html: bubble.html_content }}
                />
            </div>
        </div>
    );
}

export default BubbleView;