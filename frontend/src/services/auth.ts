import apiClient from './api';
import { User } from '../types';

export const authService = {
  async register(username: string, email: string, password: string, fullName: string) {
    const response = await apiClient.post('/auth/register', {
      username,
      email,
      password,
      fullName,
    });
    return response.data;
  },

  async login(username: string, password: string) {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
