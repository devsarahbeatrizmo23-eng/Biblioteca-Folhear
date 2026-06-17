import axios from 'axios';

// Since we're running as a single-file app without a real backend,
// we'll use localStorage as our "database" for demo purposes
const API_BASE_URL = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL
  ? (import.meta as any).env.VITE_API_URL
  : 'http://localhost:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('folhear_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('folhear_token');
      localStorage.removeItem('folhear_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
