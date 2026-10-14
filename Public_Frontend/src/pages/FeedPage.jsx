import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { getBubbles } from '../api';
import './pages.css';
import './feedPage.css';

const ALL_TAGS = ['程序', '金融', '英文', '自我'];

function FeedPage() {
    const do_navigate = useNavigate();
    const { t } = useI18n();
    const [bubbles, setBubbles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState(null);

    useEffect(() => {
        setLoading(true);
        getBubbles(activeTag)
            .then(setBubbles)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [activeTag]);

    return (
        <div className="page-container feed-layout">
            <button className="back-btn" onClick={() => do_navigate('/')}></button>

            {/* Left: Tag sidebar */}
            <div className="feed-tag-sidebar">
                <div className="feed-tag-title">{t('tags.title')}</div>
                <button
                    className={`feed-tag-btn${activeTag === null ? ' active' : ''}`}
                    onClick={() => setActiveTag(null)}
                >
                    {t('tags.all')}
                </button>
                {ALL_TAGS.map((tag) => (
                    <button
                        key={tag}
                        className={`feed-tag-btn${activeTag === tag ? ' active' : ''}`}
                        onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                    >
                        {t('tags.' + tag)}
                    </button>
                ))}
            </div>

            {/* Right: Content */}
            <div className="page-card feed-content-area" style={{ maxWidth: 720 }}>
                <h1>{t('pages.feed.title')}</h1>

                {loading && <p className="page-placeholder">{t('guestInfo.form.loading')}</p>}

                {!loading && bubbles.length === 0 && (
                    <p className="page-placeholder">{t('pages.feed.placeholder')}</p>
                )}

                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {bubbles.map((bubble) => (
                        <div
                            key={bubble.id}
                            onClick={() => do_navigate(`/bubble/${bubble.id}`)}
                            style={{
                                background: 'rgba(255,255,255,0.75)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: 14,
                                padding: '20px 24px',
                                cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.6)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 28px rgba(21,101,192,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <h3 style={{ margin: '0 0 8px 0', fontSize: 19, fontWeight: 600, color: '#1a237e' }}>
                                {bubble.title}
                            </h3>
                            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888', alignItems: 'center' }}>
                                <span style={{ fontWeight: 500, color: '#1565c0' }}>{bubble.author_name}</span>
                                <span>{new Date(bubble.created_at).toLocaleDateString()}</span>
                                {bubble.tags && bubble.tags.length > 0 && (
                                    <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                                        {bubble.tags.map((tag) => (
                                            <span key={tag} className="feed-bubble-tag">{t('tags.' + tag)}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FeedPage;