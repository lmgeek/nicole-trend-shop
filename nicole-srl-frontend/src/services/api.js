const API_URL = import.meta.env.VITE_API_URL || 'http://148.230.71.90:3001';

class ApiService {
  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      this.clearToken();
      window.location.href = '/admin/login';
      throw new Error('Sesión expirada');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(error.error || 'Error en la solicitud');
    }

    return response.json();
  }

  auth = {
    login: async (email, password) => {
      const data = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token) {
        this.setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    },

    logout: () => {
      this.clearToken();
    },

    getUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => !!localStorage.getItem('token'),
  };

  products = {
    getAll: () => this.request('/api/products'),
    getById: (id) => this.request(`/api/products/${id}`),
    create: (data) => this.request('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => this.request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => this.request(`/api/products/${id}`, { method: 'DELETE' }),
  };

  categories = {
    getAll: () => this.request('/api/categories'),
    getEnabled: () => this.request('/api/categories/enabled'),
    getById: (id) => this.request(`/api/categories/${id}`),
    create: (data) => this.request('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => this.request(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => this.request(`/api/categories/${id}`, { method: 'DELETE' }),
  };

  publicProducts = {
    getAll: () => fetch(`${API_URL}/api/public/products`).then(res => res.json()),
    getFeatured: () => fetch(`${API_URL}/api/public/products/featured`).then(res => res.json()),
  };

  clients = {
    getAll: () => this.request('/api/clients'),
    getById: (id) => this.request(`/api/clients/${id}`),
    create: (data) => this.request('/api/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => this.request(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => this.request(`/api/clients/${id}`, { method: 'DELETE' }),
  };

  sales = {
    getAll: () => this.request('/api/sales'),
    getById: (id) => this.request(`/api/sales/${id}`),
    create: (data) => this.request('/api/sales', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => this.request(`/api/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => this.request(`/api/sales/${id}`, { method: 'DELETE' }),
  };

  users = {
    getAll: () => this.request('/api/users'),
  };

  heroSlides = {
    getAll: () => this.request('/api/hero-slides'),
    getById: (id) => this.request(`/api/hero-slides/${id}`),
    getPublic: () => fetch(`${API_URL}/api/public/hero-slides`).then(res => res.json()),
    create: (data) => this.request('/api/hero-slides', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => this.request(`/api/hero-slides/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => this.request(`/api/hero-slides/${id}`, { method: 'DELETE' }),
  };
}

export const api = new ApiService();
export default api;