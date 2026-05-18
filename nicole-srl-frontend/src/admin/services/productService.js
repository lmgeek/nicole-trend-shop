import api from '@/services/api';

export const productService = {
  getAll: async () => {
    return await api.products.getAll();
  },

  getById: async (id) => {
    return await api.products.getById(id);
  },

  create: async (productData) => {
    return await api.products.create(productData);
  },

  update: async (id, productData) => {
    return await api.products.update(id, productData);
  },

  delete: async (id) => {
    return await api.products.delete(id);
  }
};

export default productService;