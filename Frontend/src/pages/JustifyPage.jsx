import { useNavigate } from 'react-router-dom';
import './pages.css';

function JustifyPage() {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>Justify</h1>
                <p className="page-placeholder">Justify section — coming soon.</p>
                <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
            </div>
        </div>
    );
}

export default JustifyPage;