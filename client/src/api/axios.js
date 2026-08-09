import axios from 'axios';

const configuredApiUrl = import.meta.env.DEV
  ? 'http://localhost:5000'
  : (import.meta.env.VITE_API_BASE_URL || 'https://productr-app-69ol.onrender.com');
const apiBaseUrl = configuredApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
export const API_ORIGIN = apiBaseUrl;

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return '';
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${API_ORIGIN}${assetPath.startsWith('/') ? '' : '/'}${assetPath}`;
};

const API = axios.create({
  baseURL: `${apiBaseUrl}/api`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;