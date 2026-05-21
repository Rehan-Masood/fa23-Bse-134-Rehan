import { Router } from './router.js';
import { Auth } from './auth.js';
import { API } from './api.js';
import { Cart } from './cart.js';
import { Utils } from './utils.js';

class App {
  constructor() {
    this.router = new Router();
    this.auth = new Auth();
    this.api = new API();
    this.cart = new Cart();
    this.utils = new Utils();
    
    this.init();
  }

  async init() {
    // Initialize router
    this.router.init();
    
    // Check authentication status
    await this.auth.checkAuthStatus();
    
    // Initialize cart
    this.cart.init();
    
    // Load initial page
    this.router.handleRoute();
    
    // Setup global event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for browser navigation
    window.addEventListener('popstate', () => {
      this.router.handleRoute();
    });

    // Listen for link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#/"]')) {
        e.preventDefault();
        const path = e.target.getAttribute('href').substring(1);
        this.router.navigate(path);
      }
    });

    // Listen for cart updates
    document.addEventListener('cartUpdated', () => {
      this.cart.updateCartCount();
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// Export for global access
window.Auth = window.app?.auth;
window.API = window.app?.api;
window.Cart = window.app?.cart;
window.Utils = window.app?.utils;
