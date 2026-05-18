import api from '@/services/api';

export const heroSlideService = {
  getAll: async () => {
    return await api.heroSlides.getAll();
  },

  getById: async (id) => {
    return await api.heroSlides.getById(id);
  },

  getPublic: async () => {
    return await api.heroSlides.getPublic();
  },

  create: async (data) => {
    return await api.heroSlides.create(data);
  },

  update: async (id, data) => {
    return await api.heroSlides.update(id, data);
  },

  delete: async (id) => {
    return await api.heroSlides.delete(id);
  },

  toggleEnabled: async (id, enabled) => {
    return await api.heroSlides.update(id, { enabled });
  }
};

export default heroSlideService;
