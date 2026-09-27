import { useEffect } from 'react';

import Background from './home_background/background.jsx';
import Greetings from './home_GreetingText/Greeting.jsx';
import GuestInformation from './home_userProfile/guest_information.jsx';
import HomeOptions from './home_options/home_options.jsx';


function App() {
  // 添加这段 useEffect 代码来向后端获取数据
  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(res => res.json())
      .then(data => console.log("成功连接！后端说:", data))
      .catch(err => console.error("连接失败:", err));
  }, []);

  return (
    <>
      <Background />
      <main className="content-layer">
        <Greetings />
        <GuestInformation />
        <HomeOptions />
      </main>
    </>
  );
}

export default App;