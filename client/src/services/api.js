import axios from 'axios';

// Development: Vite proxies /api → localhost:9006 (see vite.config.js).
// Production: VITE_API_URL may be configured as either the Render origin or
// the complete /api base; normalize both forms to the mounted API prefix.
const configuredBaseURL = import.meta.env.VITE_API_URL?.trim();
const apiBaseURL = configuredBaseURL || (import.meta.env.PROD ? 'https://venma.onrender.com/api' : '/api');
const baseURL = apiBaseURL.replace(/\/+$/, '').endsWith('/api')
  ? apiBaseURL.replace(/\/+$/, '')
  : `${apiBaseURL.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,          // required for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('venma_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 — try to refresh the token once, then redirect to login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('venma_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
          if (res.data?.success) {
            localStorage.setItem('venma_token', res.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return api(originalRequest);
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
