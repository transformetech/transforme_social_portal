import axios from 'axios';

export const $api = axios.create({
  baseURL: 'http://localhost:8080/api/portal-doador',
  headers: {
    'Content-Type': 'application/json'
  }
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
