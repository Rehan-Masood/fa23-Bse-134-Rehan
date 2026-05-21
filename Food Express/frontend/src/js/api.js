export class API {
  constructor() {
    this.baseURL = '/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Auth endpoints
  async login(credentials) {
    return this.post('/auth/login', credentials);
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  // Restaurant endpoints
  async getRestaurants(params = {}) {
    return this.get('/restaurants', params);
  }

  async getRestaurant(id) {
    return this.get(`/restaurants/${id}`);
  }

  async getRestaurantMenu(restaurantId) {
    return this.get(`/restaurants/${restaurantId}/menu`);
  }

  // Menu item endpoints
  async getMenuItems(params = {}) {
    return this.get('/menu-items', params);
  }

  async getMenuItem(id) {
    return this.get(`/menu-items/${id}`);
  }

  // Cart endpoints
  async getCart() {
    return this.get('/cart');
  }

  async addToCart(menuItemId, quantity = 1) {
    return this.post('/cart/add', { menuItemId, quantity });
  }

  async updateCartItem(cartItemId, quantity) {
    return this.patch(`/cart/${cartItemId}`, { quantity });
  }

  async removeFromCart(cartItemId) {
    return this.delete(`/cart/${cartItemId}`);
  }

  async clearCart() {
    return this.delete('/cart');
  }

  // Order endpoints
  async getOrders(params = {}) {
    return this.get('/orders', params);
  }

  async getOrder(id) {
    return this.get(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  async updateOrderStatus(orderId, status) {
    return this.patch(`/orders/${orderId}`, { status });
  }

  async cancelOrder(orderId, reason) {
    return this.patch(`/orders/${orderId}/cancel`, { reason });
  }

  // Category endpoints
  async getCategories(params = {}) {
    return this.get('/categories', params);
  }

  // Review endpoints
  async getReviews(params = {}) {
    return this.get('/reviews', params);
  }

  async createReview(reviewData) {
    return this.post('/reviews', reviewData);
  }

  // Promotion endpoints
  async getPromotions(params = {}) {
    return this.get('/promotions', params);
  }

  async validatePromoCode(code) {
    return this.post('/promotions/validate', { code });
  }

  // Favorite endpoints
  async getFavorites() {
    return this.get('/favorites');
  }

  async addToFavorites(menuItemId) {
    return this.post('/favorites', { menuItemId });
  }

  async removeFromFavorites(menuItemId) {
    return this.delete(`/favorites/${menuItemId}`);
  }

  // Reservation endpoints
  async getReservations(params = {}) {
    return this.get('/reservations', params);
  }

  async createReservation(reservationData) {
    return this.post('/reservations', reservationData);
  }

  async updateReservation(reservationId, data) {
    return this.patch(`/reservations/${reservationId}`, data);
  }

  async cancelReservation(reservationId) {
    return this.delete(`/reservations/${reservationId}`);
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.get('/admin/dashboard');
  }

  async getAllUsers(params = {}) {
    return this.get('/admin/users', params);
  }

  async getAllOrders(params = {}) {
    return this.get('/admin/orders', params);
  }

  async getAllRestaurants(params = {}) {
    return this.get('/admin/restaurants', params);
  }

  async createRestaurant(restaurantData) {
    return this.post('/admin/restaurants', restaurantData);
  }

  async updateRestaurant(id, data) {
    return this.put(`/admin/restaurants/${id}`, data);
  }

  async deleteRestaurant(id) {
    return this.delete(`/admin/restaurants/${id}`);
  }

  async getAllMenuItems(params = {}) {
    return this.get('/admin/menu-items', params);
  }

  async createMenuItem(menuItemData) {
    return this.post('/admin/menu-items', menuItemData);
  }

  async updateMenuItem(id, data) {
    return this.put(`/admin/menu-items/${id}`, data);
  }

  async deleteMenuItem(id) {
    return this.delete(`/admin/menu-items/${id}`);
  }

  async getAllPromotions(params = {}) {
    return this.get('/admin/promotions', params);
  }

  async createPromotion(promotionData) {
    return this.post('/admin/promotions', promotionData);
  }

  async updatePromotion(id, data) {
    return this.put(`/admin/promotions/${id}`, data);
  }

  async deletePromotion(id) {
    return this.delete(`/admin/promotions/${id}`);
  }

  async getAllReviews(params = {}) {
    return this.get('/admin/reviews', params);
  }

  async deleteReview(id) {
    return this.delete(`/admin/reviews/${id}`);
  }
}
