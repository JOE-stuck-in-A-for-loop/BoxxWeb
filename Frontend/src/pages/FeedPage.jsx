import { useNavigate } from 'react-router-dom';
import './pages.css';

function FeedPage() {
    const do_navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>Feed</h1>
                <p className="page-placeholder">Your feed will appear here — posts, tags, following, and more.</p>
                <button className="back-btn" onClick={() => do_navigate('/')}>← Back to Home</button>
            </div>
        </div>
    );
}

export default FeedPage;