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
    fetch("http://47.102.43.26:8000/")
      .then(res => res.json())
      .then(data => console.log("成功连接！后端说:", data))
      .catch(err => console.error("连接失败:", err));
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