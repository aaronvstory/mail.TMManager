import axios from 'axios';

const API_BASE_URL = 'https://api.mail.tm';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mailTmApi = {
  async createAccount(address, password) {
    const response = await api.post('/accounts', { address, password });
    return response.data;
  },

  async login(address, password) {
    const response = await api.post('/token', { address, password });
    return response.data;
  },

  async getDomains() {
    const response = await api.get('/domains');
    return response.data['hydra:member'];
  },

  async getMessages(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await api.get('/messages');
    return response.data['hydra:member'];
  },

  async getMessage(token, id) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await api.get(`/messages/${id}`);
    return response.data;
  },

  async deleteMessage(token, id) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await api.delete(`/messages/${id}`);
  },

  async deleteAccount(token, id) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await api.delete(`/accounts/${id}`);
  }
};
