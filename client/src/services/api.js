import axios from 'axios';

/**
 * API base URL resolution — one clear rule:
 *
 * Production (import.meta.env.PROD === true):
 *   Use VITE_API_URL from Vercel env vars.
 *   If not set, fall back to the known Render /api endpoint.
 *   The value must end in /api — never a plain origin.
 *
 * Development:
 *   Use /api which Vite proxies to localhost:9006 (see vite.config.js).
 */
function resolveBaseURL() {
  if (!import.meta.env.PROD) return '/api';

  const configured = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
  if (configured) {
    // Accept both "https://venma.onrender.com" and "https://venma.onrender.com/api"
    return configured.endsWith('/api') ? configured : `${configured}/api`;
  }

  // Hard fallback — guarantees the site works even with no Vercel env var set
  return 'https://venma.onrender.com/api';
}

const baseURL = resolveBaseURL();

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('venma_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh JWT on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('venma_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
          if (res.data?.success) {
            localStorage.setItem('venma_token', res.data.accessToken);
            original.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return api(original);
          }
        } catch {
          localStorage.removeItem('venma_token');
          localStorage.removeItem('venma_refresh_token');
          localStorage.removeItem('venma_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
