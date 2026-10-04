const API_BASE = '/api';

/**
 * 从 localStorage 获取 JWT token
 */
function getToken() {
  return localStorage.getItem('boxx_token');
}

/**
 * 带错误处理的通用请求函数
 */
async function request(url, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  // 处理 204 No Content
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.detail || '请求失败');
    error.status = res.status;
    throw error;
  }

  return data;
}

/**
 * 注册新用户
 */
export function register(username, password, idNumber) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, id_number: idNumber }),
  });
}

/**
 * 登录，返回 JWT token
 */
export function login(username, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

/**
 * 获取当前登录用户的信息
 */
export function getMe() {
  return request('/me');
}

export default { register, login, getMe };