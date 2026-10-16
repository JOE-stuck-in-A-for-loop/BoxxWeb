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

  // Try to parse JSON; fall back to status text if it fails
  let data;
  try {
    data = await res.json();
  } catch {
    data = { detail: res.statusText || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    const error = new Error(data.detail || '请求失败');
    error.status = res.status;
    throw error;
  }

  return data;
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

/**
 * 获取所有 bubbles（已发布的帖子）
 */
export function getBubbles() {
  return request('/bubbles');
}

/**
 * 获取单个 bubble
 */
export function getBubble(id) {
  return request(`/bubbles/${id}`);
}

/**
 * 创建新的 bubble
 */
export function createBubble(title, htmlContent, tags = []) {
  return request('/bubbles', {
    method: 'POST',
    body: JSON.stringify({ title, html_content: htmlContent, tags }),
  });
}

export default { login, getMe, getBubbles, getBubble, createBubble };