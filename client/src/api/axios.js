import axios from 'axios';

// In local dev this stays '/api' — Vite's dev server proxies that to
// localhost:5000 (see vite.config.js). In production, client and server are
// typically deployed to different hosts (e.g. Vercel + Render), so
// VITE_API_URL must be set at build time to the deployed backend's full URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stca_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
