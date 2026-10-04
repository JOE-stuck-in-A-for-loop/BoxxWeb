import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useI18n } from '../../i18n';
import { getBubbles } from '../../api';
import '../pages.css';
import './feedPage.css';

function FeedPage() {
    const do_navigate = useNavigate();
    const { isAuthenticated } = useAuth();
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

            <div className="feed-content">
                <div className="feed-header">
                    <h1>{t('pages.feed.title')}</h1>
                    {isAuthenticated && (
                        <button className="new-bubble-btn" onClick={() => do_navigate('/admin/editor')}>
                            + New Bubble
                        </button>
                    )}
                </div>

                {loading && <p className="feed-status">{t('guestInfo.form.loading')}</p>}

                {!loading && bubbles.length === 0 && (
                    <p className="feed-status">{t('pages.feed.placeholder')}</p>
                )}

                <div className="bubble-list">
                    {bubbles.map((bubble) => (
                        <div key={bubble.id} className="bubble-card">
                            <h3 className="bubble-title">{bubble.title}</h3>
                            <div className="bubble-meta">
                                <span className="bubble-author">{bubble.author_name}</span>
                                <span className="bubble-date">
                                    {new Date(bubble.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FeedPage;