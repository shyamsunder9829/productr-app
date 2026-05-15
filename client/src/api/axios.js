import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const normalizedBaseURL = rawBaseURL.replace(/\/+$|\s+$/g, '').endsWith('/api')
  ? rawBaseURL.replace(/\s+$/g, '')
  : `${rawBaseURL.replace(/\/+$|\s+$/g, '')}/api`;

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