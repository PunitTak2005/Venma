import axios from 'axios';

// In development Vite proxies /api → localhost:9006.
// In production the env var points directly to the Render backend.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
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

// Response interceptor to handle token refresh if needed
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
        } catch (refreshErr) {
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
