import { useNavigate } from 'react-router-dom';
import './pages.css';

function ExplorePage() {
    const do_navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>Explore</h1>
                <p className="page-placeholder">Explore section — discover new content and people.</p>
                <button className="back-btn" onClick={() => do_navigate('/')}>← Back to Home</button>
            </div>
        </div>
    );
}

export default ExplorePage;