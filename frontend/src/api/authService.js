import api from './api';

export const authService = {
  // Register a new user
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Login user
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Get current user profile
  getProfile: () => {
    return api.get('/auth/profile');
  }
};
