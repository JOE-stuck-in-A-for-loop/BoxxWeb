import { useNavigate } from 'react-router-dom';
import './pages.css';

function JustifyPage() {
    const do_navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>Justify</h1>
                <p className="page-placeholder">Justify section — coming soon.</p>
                <button className="back-btn" onClick={() => do_navigate('/')}>← Back to Home</button>
            </div>
        </div>
    );
}

export default JustifyPage;