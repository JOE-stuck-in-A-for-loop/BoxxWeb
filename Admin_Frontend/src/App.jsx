import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Background from './home_background/background.jsx';
import Greetings from './home_GreetingText/Greeting.jsx';
import GuestInformation from './home_userProfile/guest_information.jsx';
import HomeOptions from './home_options/home_options.jsx';
import LangSwitcher from './langSwitcher.jsx';

import FeedPage from './pages/feed/FeedPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import JustifyPage from './pages/JustifyPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import PostEditor from './pages/editor/PostEditor.jsx';

function App() {
  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(data => console.log("✅ 后端连接成功:", data))
      .catch(err => console.error("❌ 后端连接失败:", err));
  }, []);

  return (
    <Background>
      <LangSwitcher />
      <Routes>
        <Route path="/" element={
          <>
            <Greetings />
            <main className="content-layer">
              <GuestInformation />
              <HomeOptions />
            </main>
          </>
        } />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/contact" element={<ChatPage />} />
        <Route path="/justify" element={<JustifyPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/admin/editor" element={<PostEditor />} />
      </Routes>
    </Background>
  );
}

export default App;