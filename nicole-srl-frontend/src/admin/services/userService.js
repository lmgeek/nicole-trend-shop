import api from '@/services/api';

export const userService = {
  getAll: async () => {
    return await api.users.getAll();
  },

  getById: async (id) => {
    const users = await api.users.getAll();
    return users.find(u => u._id === id);
  },

  login: async (email, password) => {
    return await api.auth.login(email, password);
  },

  logout: () => {
    api.auth.logout();
  },

  getCurrentUser: () => {
    return api.auth.getUser();
  },

  isAuthenticated: () => {
    return api.auth.isAuthenticated();
  }
};

export default userService;