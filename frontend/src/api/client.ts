import axios from 'axios';

// Force localhost in development, use env var in production
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment
    ? 'http://localhost:3000/api/v1'
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1');

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

export default apiClient;
