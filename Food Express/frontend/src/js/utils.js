export class Utils {
  constructor() {
    this.toastContainer = null;
  }

  showToast(message, type = 'info') {
    if (!this.toastContainer) {
      this.toastContainer = document.getElementById('toast-container');
    }

    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
      <div id="${toastId}" class="toast toast-${type}" role="alert">
        <div class="toast-body">
          <div class="d-flex align-items-center">
            <i class="fas ${this.getToastIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>
    `;

    this.toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 3000
    });
    
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }

  getToastIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
  }

  formatPrice(price) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date) {
    return new Date(date).toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateTime(date) {
    return `${this.formatDate(date)} at ${this.formatTime(date)}`;
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  validatePassword(password) {
    return password.length >= 6;
  }

  generateOrderNumber() {
    return 'ORD-' + Date.now().toString(36).toUpperCase();
  }

  getStatusBadgeClass(status) {
    const classes = {
      PENDING: 'bg-warning',
      PREPARING: 'bg-info',
      OUT_FOR_DELIVERY: 'bg-primary',
      DELIVERED: 'bg-success',
      CANCELLED: 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  }

  getStatusIcon(status) {
    const icons = {
      PENDING: 'fa-clock',
      PREPARING: 'fa-fire',
      OUT_FOR_DELIVERY: 'fa-truck',
      DELIVERED: 'fa-check-circle',
      CANCELLED: 'fa-times-circle'
    };
    return icons[status] || 'fa-question-circle';
  }

  getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star text-warning"></i>';
    }
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
  }

  showLoading(element) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }
    if (element) {
      element.innerHTML = '<div class="spinner"></div>';
    }
  }

  hideLoading(element, content) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }
    if (element && content !== undefined) {
      element.innerHTML = content;
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Copied to clipboard!', 'success');
    }).catch(() => {
      this.showToast('Failed to copy to clipboard', 'error');
    });
  }

  downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  getElements(selector) {
    return document.querySelectorAll(selector);
  }

  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  addEventListeners(selector, event, handler) {
    const elements = this.getElements(selector);
    elements.forEach(element => {
      element.addEventListener(event, handler);
    });
  }

  removeElement(selector) {
    const element = this.getElement(selector);
    if (element) {
      element.remove();
    }
  }

  toggleClass(selector, className) {
    const element = this.getElement(selector);
    if (element) {
      element.classList.toggle(className);
    }
  }

  addClass(selector, className) {
    const element = this.getElement(selector);
    if (element) {
      element.classList.add(className);
    }
  }

  removeClass(selector, className) {
    const element = this.getElement(selector);
    if (element) {
      element.classList.remove(className);
    }
  }

  hasClass(selector, className) {
    const element = this.getElement(selector);
    return element ? element.classList.contains(className) : false;
  }

  setAttribute(selector, attribute, value) {
    const element = this.getElement(selector);
    if (element) {
      element.setAttribute(attribute, value);
    }
  }

  getAttribute(selector, attribute) {
    const element = this.getElement(selector);
    return element ? element.getAttribute(attribute) : null;
  }

  setValue(selector, value) {
    const element = this.getElement(selector);
    if (element) {
      element.value = value;
    }
  }

  getValue(selector) {
    const element = this.getElement(selector);
    return element ? element.value : '';
  }

  getFormData(formSelector) {
    const form = this.getElement(formSelector);
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }

  clearForm(formSelector) {
    const form = this.getElement(formSelector);
    if (form) {
      form.reset();
    }
  }

  confirm(message, callback) {
    if (confirm(message)) {
      callback();
    }
  }

  prompt(message, defaultValue = '') {
    return prompt(message, defaultValue);
  }

  alert(message) {
    alert(message);
  }

  log(...args) {
    console.log(...args);
  }

  error(...args) {
    console.error(...args);
  }

  warn(...args) {
    console.warn(...args);
  }
}
