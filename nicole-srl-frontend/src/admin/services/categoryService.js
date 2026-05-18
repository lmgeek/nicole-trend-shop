import api from '@/services/api';

export const categoryService = {
  getAll: async () => {
    return await api.categories.getAll();
  },

  getEnabled: async () => {
    return await api.categories.getEnabled();
  },

  getById: async (id) => {
    return await api.categories.getById(id);
  },

  create: async (categoryData) => {
    return await api.categories.create(categoryData);
  },

  update: async (id, categoryData) => {
    return await api.categories.update(id, categoryData);
  },

  delete: async (id) => {
    return await api.categories.delete(id);
  },

  toggleEnabled: async (id, enabled) => {
    return await api.categories.update(id, { enabled });
  }
};

export default categoryService;
