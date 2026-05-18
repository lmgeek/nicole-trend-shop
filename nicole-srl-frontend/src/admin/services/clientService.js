import api from '@/services/api';

export const clientService = {
  getAll: async () => {
    return await api.clients.getAll();
  },

  getById: async (id) => {
    return await api.clients.getById(id);
  },

  create: async (clientData) => {
    return await api.clients.create(clientData);
  },

  update: async (id, clientData) => {
    return await api.clients.update(id, clientData);
  },

  delete: async (id) => {
    return await api.clients.delete(id);
  }
};

export default clientService;