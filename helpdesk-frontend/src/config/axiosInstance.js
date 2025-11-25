/**
 * Axios Configuration for Orval Generated Client
 * 
 * This file configures the axios instance used by Orval generated API client
 * to point to the correct backend API endpoint.
 */

import Axios from 'axios';

// Create axios instance with base URL
export const axiosInstance = Axios.create({
  baseURL: '/api', // Use Vite proxy
});

// Add request interceptor (optional - for debugging)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor (optional - for error handling)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;