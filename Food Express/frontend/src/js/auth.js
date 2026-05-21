import { API } from './api.js';
import { Utils } from './utils.js';

export class Auth {
  constructor() {
    this.api = new API();
    this.utils = new Utils();
    this.currentUser = null;
  }

  async checkAuthStatus() {
    try {
      const token = this.getToken();
      if (!token) {
        this.updateUI(false);
        return false;
      }

      const response = await this.api.get('/auth/profile');
      if (response.success) {
        this.currentUser = response.data;
        this.updateUI(true);
        return true;
      } else {
        this.removeToken();
        this.updateUI(false);
        return false;
      }
    } catch (error) {
      this.removeToken();
      this.updateUI(false);
      return false;
    }
  }

  async login(email, password) {
    try {
      const response = await this.api.post('/auth/login', { email, password });
      
      if (response.success) {
        this.setToken(response.data.access_token);
        this.currentUser = response.data.user;
        this.updateUI(true);
        this.utils.showToast('Login successful!', 'success');
        
        // Redirect based on role
        if (response.data.user.role === 'ADMIN') {
          window.location.hash = '/admin';
        } else {
          window.location.hash = '/';
        }
        
        return true;
      } else {
        this.utils.showToast(response.message || 'Login failed', 'error');
        return false;
      }
    } catch (error) {
      this.utils.showToast('Login failed. Please try again.', 'error');
      return false;
    }
  }

  async register(userData) {
    try {
      const response = await this.api.post('/auth/register', userData);
      
      if (response.success) {
        this.setToken(response.data.access_token);
        this.currentUser = response.data.user;
        this.updateUI(true);
        this.utils.showToast('Registration successful!', 'success');
        
        // Redirect to home
        window.location.hash = '/';
        return true;
      } else {
        this.utils.showToast(response.message || 'Registration failed', 'error');
        return false;
      }
    } catch (error) {
      this.utils.showToast('Registration failed. Please try again.', 'error');
      return false;
    }
  }

  async logout() {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
      this.currentUser = null;
      this.updateUI(false);
      this.utils.showToast('Logged out successfully', 'success');
      window.location.hash = '/';
    }
  }

  getToken() {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
  }

  setToken(token) {
    document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
  }

  removeToken() {
    document.cookie = 'access_token=; path=/; max-age=0; SameSite=Strict';
  }

  updateUI(isAuthenticated) {
    const userMenu = document.getElementById('user-menu');
    const authMenu = document.getElementById('auth-menu');
    const adminMenu = document.getElementById('admin-menu');

    if (isAuthenticated && this.currentUser) {
      userMenu.style.display = 'block';
      authMenu.style.display = 'none';
      
      // Show admin menu for admin users
      if (this.currentUser.role === 'ADMIN') {
        adminMenu.style.display = 'block';
      } else {
        adminMenu.style.display = 'none';
      }
    } else {
      userMenu.style.display = 'none';
      authMenu.style.display = 'block';
      adminMenu.style.display = 'none';
    }
  }

  isAuthenticated() {
    return !!this.getToken() && !!this.currentUser;
  }

  isAdmin() {
    return this.isAuthenticated() && this.currentUser.role === 'ADMIN';
  }

  getCurrentUser() {
    return this.currentUser;
  }

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.hash = '/login';
      return false;
    }
    return true;
  }

  requireAdmin() {
    if (!this.isAdmin()) {
      this.utils.showToast('Access denied. Admin privileges required.', 'error');
      window.location.hash = '/';
      return false;
    }
    return true;
  }
}
