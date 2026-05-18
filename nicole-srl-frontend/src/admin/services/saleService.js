import api from '@/services/api';

export const saleService = {
  getAll: async () => {
    return await api.sales.getAll();
  },

  getById: async (id) => {
    return await api.sales.getById(id);
  },

  create: async (saleData) => {
    return await api.sales.create(saleData);
  },

  update: async (id, saleData) => {
    return await api.sales.update(id, saleData);
  },

  delete: async (id) => {
    return await api.sales.delete(id);
  }
};

export default saleService;