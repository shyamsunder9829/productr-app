/**
 * @fileoverview Axios instance configuration and interceptors.
 * Sets up the API client with JWT token handling and automatic
 * redirect on unauthorized access (401).
 */

import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Normalizes a URL by trimming whitespace and removing trailing slashes
 * @param {string} url - The URL to normalize
 * @returns {string} Normalized URL
 */
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

/**
 * Axios instance with normalized base URL
 * @type {AxiosInstance}
 */
const API = axios.create({
  baseURL: normalizedBaseURL,
});

/**
 * Request interceptor: Adds JWT token to authorization header
 */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Response interceptor: Handles errors and redirects to login on 401
 */
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