import { useNavigate } from 'react-router-dom';
import './pages.css';

function ChatPage() {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="page-card">
                <h1>Chat</h1>
                <p className="page-placeholder">Your messages and groups will appear here — a mini-Discord style chat.</p>
                <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
            </div>
        </div>
    );
}

export default ChatPage;