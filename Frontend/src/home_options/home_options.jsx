import { useNavigate } from 'react-router-dom';
import './home_options.css';

function HomeOptions() {
    const navigate = useNavigate();

    return (
        <div className="home_options">
            <button className="opt-btn feed" onClick={() => navigate('/feed')}>Feed</button>
            <button className="opt-btn chat" onClick={() => navigate('/chat')}>Chat</button>
            <button className="opt-btn justify" onClick={() => navigate('/justify')}>Justify</button>
            <button className="opt-btn explore" onClick={() => navigate('/explore')}>Explore</button>
        </div>
    );
}

export default HomeOptions;