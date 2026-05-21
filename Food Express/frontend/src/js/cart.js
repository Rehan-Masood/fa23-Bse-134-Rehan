import { API } from './api.js';
import { Utils } from './utils.js';

export class Cart {
  constructor() {
    this.api = new API();
    this.utils = new Utils();
    this.items = [];
    this.isOpen = false;
  }

  async init() {
    await this.loadCart();
    this.setupCartUI();
    this.updateCartCount();
  }

  async loadCart() {
    try {
      const response = await this.api.getCart();
      if (response.success) {
        this.items = response.data.items || [];
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      this.items = [];
    }
  }

  setupCartUI() {
    // Create cart sidebar if it doesn't exist
    if (!document.getElementById('cart-sidebar')) {
      const cartHTML = `
        <div id="cart-sidebar" class="cart-sidebar">
          <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 class="mb-0">
              <i class="fas fa-shopping-cart me-2"></i>Your Cart
            </h5>
            <button class="btn-close" onclick="cart.close()"></button>
          </div>
          
          <div class="cart-items-container p-3" style="max-height: 60vh; overflow-y: auto;">
            <!-- Cart items will be loaded here -->
          </div>
          
          <div class="cart-summary p-3 border-top">
            <div class="d-flex justify-content-between mb-3">
              <strong>Total:</strong>
              <strong class="cart-total">Rs. 0</strong>
            </div>
            <button class="btn btn-primary w-100" onclick="cart.checkout()">
              Proceed to Checkout
            </button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', cartHTML);
    }
  }

  async addItem(menuItemId, quantity = 1) {
    try {
      const response = await this.api.addToCart(menuItemId, quantity);
      if (response.success) {
        await this.loadCart();
        this.renderCart();
        this.updateCartCount();
        this.utils.showToast('Item added to cart!', 'success');
        
        // Open cart sidebar
        this.open();
      } else {
        this.utils.showToast(response.message || 'Failed to add item to cart', 'error');
      }
    } catch (error) {
      this.utils.showToast('Failed to add item to cart', 'error');
    }
  }

  async updateQuantity(cartItemId, quantity) {
    if (quantity < 1) {
      await this.removeItem(cartItemId);
      return;
    }

    try {
      const response = await this.api.updateCartItem(cartItemId, quantity);
      if (response.success) {
        await this.loadCart();
        this.renderCart();
        this.updateCartCount();
      }
    } catch (error) {
      this.utils.showToast('Failed to update cart', 'error');
    }
  }

  async removeItem(cartItemId) {
    try {
      const response = await this.api.removeFromCart(cartItemId);
      if (response.success) {
        await this.loadCart();
        this.renderCart();
        this.updateCartCount();
        this.utils.showToast('Item removed from cart', 'success');
      }
    } catch (error) {
      this.utils.showToast('Failed to remove item', 'error');
    }
  }

  async clearCart() {
    try {
      const response = await this.api.clearCart();
      if (response.success) {
        this.items = [];
        this.renderCart();
        this.updateCartCount();
        this.utils.showToast('Cart cleared', 'success');
      }
    } catch (error) {
      this.utils.showToast('Failed to clear cart', 'error');
    }
  }

  renderCart() {
    const container = document.querySelector('.cart-items-container');
    const totalElement = document.querySelector('.cart-total');
    
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <p class="text-muted">Your cart is empty</p>
          <a href="#/restaurants" class="btn btn-primary" onclick="cart.close()">
            Browse Restaurants
          </a>
        </div>
      `;
      totalElement.textContent = 'Rs. 0';
      return;
    }

    let total = 0;
    const itemsHTML = this.items.map(item => {
      const itemTotal = item.menuItem.price * item.quantity;
      total += itemTotal;
      
      return `
        <div class="cart-item">
          <div class="d-flex align-items-center">
            <img src="${item.menuItem.imageUrl}" alt="${item.menuItem.name}" 
                 class="me-3" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div class="flex-grow-1">
              <h6 class="mb-1">${item.menuItem.name}</h6>
              <small class="text-muted">Rs. ${item.menuItem.price} each</small>
            </div>
            <div class="text-end">
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                  <i class="fas fa-minus"></i>
                </button>
                <span class="mx-2">${item.quantity}</span>
                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div class="mt-2">
                <strong>Rs. ${itemTotal}</strong>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger ms-2" onclick="cart.removeItem('${item.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = itemsHTML;
    totalElement.textContent = `Rs. ${total}`;
  }

  updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
      const count = this.items.reduce((total, item) => total + item.quantity, 0);
      countElement.textContent = count;
      countElement.style.display = count > 0 ? 'block' : 'none';
    }
  }

  open() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
      sidebar.classList.add('open');
      this.isOpen = true;
      this.renderCart();
    }
  }

  close() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
      sidebar.classList.remove('open');
      this.isOpen = false;
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  checkout() {
    if (this.items.length === 0) {
      this.utils.showToast('Your cart is empty', 'error');
      return;
    }

    // Redirect to checkout page
    window.location.hash = '/checkout';
    this.close();
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }
}
