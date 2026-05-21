import { Home } from '../pages/home.js';
import { Restaurants } from '../pages/restaurants.js';
import { RestaurantDetail } from '../pages/restaurant-detail.js';
import { Cart } from '../pages/cart.js';
import { Orders } from '../pages/orders.js';
import { Profile } from '../pages/profile.js';
import { Login } from '../pages/login.js';
import { Register } from '../pages/register.js';
import { Admin } from '../pages/admin/admin.js';

export class Router {
  constructor() {
    this.routes = {
      '/': Home,
      '/restaurants': Restaurants,
      '/restaurant/:id': RestaurantDetail,
      '/cart': Cart,
      '/orders': Orders,
      '/profile': Profile,
      '/login': Login,
      '/register': Register,
      '/admin': Admin,
      '/admin/*': Admin,
    };
  }

  init() {
    // Handle initial route
    this.handleRoute();
  }

  navigate(path) {
    // Update browser history
    history.pushState(null, null, `#${path}`);
    this.handleRoute();
  }

  async handleRoute() {
    const currentPath = window.location.hash.substring(1) || '/';
    const pageContent = document.getElementById('page-content');
    
    // Show loading state
    pageContent.innerHTML = `
      <div class="d-flex justify-content-center align-items-center" style="height: 400px;">
        <div class="spinner"></div>
      </div>
    `;

    try {
      // Find matching route
      let PageClass = null;
      let params = {};

      for (const route in this.routes) {
        if (this.matchRoute(route, currentPath)) {
          PageClass = this.routes[route];
          params = this.extractParams(route, currentPath);
          break;
        }
      }

      if (!PageClass) {
        // 404 page
        pageContent.innerHTML = `
          <div class="container text-center py-5">
            <h1 class="display-1">404</h1>
            <h2>Page Not Found</h2>
            <p class="lead">The page you're looking for doesn't exist.</p>
            <a href="#/" class="btn btn-primary">Go Home</a>
          </div>
        `;
        return;
      }

      // Initialize and render page
      const page = new PageClass();
      await page.render(pageContent, params);

    } catch (error) {
      console.error('Router error:', error);
      pageContent.innerHTML = `
        <div class="container text-center py-5">
          <h1 class="display-1">Error</h1>
          <p class="lead">Something went wrong. Please try again.</p>
          <a href="#/" class="btn btn-primary">Go Home</a>
        </div>
      `;
    }
  }

  matchRoute(route, path) {
    // Convert route to regex pattern
    const pattern = route
      .replace(/:[^/]+/g, '([^/]+)')
      .replace(/\*/g, '.*');
    
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  }

  extractParams(route, path) {
    const params = {};
    
    // Extract parameter names from route
    const paramNames = [];
    const routeParts = route.split('/');
    const pathParts = path.split('/');

    routeParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        paramNames.push(part.substring(1));
      }
    });

    // Extract parameter values from path
    paramNames.forEach((name, index) => {
      params[name] = pathParts[index + 1];
    });

    return params;
  }
}
