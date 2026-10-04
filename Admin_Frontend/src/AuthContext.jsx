import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, getMe } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 启动时检查登录状态

  // 页面加载时，检查 localStorage 是否有 token
  useEffect(() => {
    const token = localStorage.getItem('boxx_token');
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        // token 无效或过期，清掉
        localStorage.removeItem('boxx_token');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password);
    localStorage.setItem('boxx_token', data.access_token);
    // 用 token 获取用户信息
    const userData = await getMe();
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('boxx_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return ctx;
}

export default AuthContext;