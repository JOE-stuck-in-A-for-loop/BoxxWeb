import './home_options.css';

function HomeOptions() {
    return (
        <div className="home_options">
            <button className="opt-btn feed">Feed</button>
            <button className="opt-btn chat">Chat</button>
            <button className="opt-btn justify">Justify</button>
            <button className="opt-btn explore">Explore</button>
        </div>
    );
}

export default HomeOptions;