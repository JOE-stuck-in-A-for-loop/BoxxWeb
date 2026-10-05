import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { getBubbles } from '../api';
import './pages.css';

function FeedPage() {
    const do_navigate = useNavigate();
    const { t } = useI18n();
    const [bubbles, setBubbles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBubbles()
            .then(setBubbles)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-container">
            <button className="back-btn" onClick={() => do_navigate('/')}></button>

            <div className="page-card" style={{ maxWidth: 720 }}>
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
                            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888' }}>
                                <span style={{ fontWeight: 500, color: '#1565c0' }}>{bubble.author_name}</span>
                                <span>{new Date(bubble.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FeedPage;