import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(data => console.log("✅ 后端连接成功:", data))
      .catch(err => console.error("❌ 后端连接失败:", err));
  }, []);

  // 编辑器页面是全屏布局，隐藏底部法律信息
  const showFooter = location.pathname !== '/admin/editor';

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

      {/* ⚖️ 法律信息 — fixed 底部叠加，不占用文档流 */}
      {showFooter && (
        <footer style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          textAlign: 'center',
          padding: '10px 20px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.65)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.35))',
          pointerEvents: 'auto',
        }}>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}
          >
            冀ICP备2026045455号-1
          </a>

          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=13053202001862"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <img
              src="/gongan.png"
              style={{ width: '14px', height: '14px' }}
              alt="公安备案"
            />
            冀公网安备13053202001862号
          </a>
        </footer>
      )}
    </Background>
  );
}

export default App;