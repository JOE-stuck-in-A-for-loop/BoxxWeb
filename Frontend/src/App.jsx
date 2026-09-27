import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Background from './home_background/background.jsx';
import Greetings from './home_GreetingText/Greeting.jsx';
import GuestInformation from './home_userProfile/guest_information.jsx';
import HomeOptions from './home_options/home_options.jsx';

import FeedPage from './pages/FeedPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import JustifyPage from './pages/JustifyPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';

function App() {
  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(res => res.json())
      .then(data => console.log("成功连接！后端说:", data))
      .catch(err => console.error("连接失败:", err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <>
          <Background />
          <main className="content-layer">
            <Greetings />
            <GuestInformation />
            <HomeOptions />
          </main>
        </>
      } />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/justify" element={<JustifyPage />} />
      <Route path="/explore" element={<ExplorePage />} />
    </Routes>
  );
}

export default App;