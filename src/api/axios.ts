import axios from 'axios';
import { getAccessToken, logout } from '../utils/auth';
import toast from 'react-hot-toast';

// Create Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Default error message
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          errorMessage = 'Session expired. Please log in again.';
          logout();
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          // Use error message from response if available
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
      }
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = 'Network error. Please check your connection.';
    }
    
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default api;