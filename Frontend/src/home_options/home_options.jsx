import { useNavigate } from 'react-router-dom';
import './home_options.css';

function HomeOptions() {
    const do_navigate = useNavigate();

    return (
        <div className="home_options">
            <button className="opt-btn feed" onClick={() => do_navigate('/feed')}>Feed</button>
            <button className="opt-btn chat" onClick={() => do_navigate('/chat')}>Chat</button>
            <button className="opt-btn justify" onClick={() => do_navigate('/justify')}>Justify</button>
            <button className="opt-btn explore" onClick={() => do_navigate('/explore')}>Explore</button>
        </div>
    );
}

export default HomeOptions;