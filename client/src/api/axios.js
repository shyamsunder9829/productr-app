import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const normalizeUrl = (url) => {
  const trimmed = url.trim().replace(/\/+$/g, '');
  try {
    return new URL(trimmed).toString().replace(/\/+$/g, '');
  } catch {
    return trimmed;
  }
};

const normalizedBaseURL = normalizeUrl(rawBaseURL).endsWith('/api')
  ? normalizeUrl(rawBaseURL)
  : `${normalizeUrl(rawBaseURL)}/api`;

const API = axios.create({
  baseURL: normalizedBaseURL,
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