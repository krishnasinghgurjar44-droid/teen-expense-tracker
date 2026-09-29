import api from './api';

export const dashboardService = {
  async getSummary(month, year) {
    const res = await api.get('/dashboard/summary', {
      params: { month, year }
    });
    return res.data;
  },

  async getRecent(limit = 5) {
    const res = await api.get('/dashboard/recent', {
      params: { limit }
    });
    return res.data;
  },

  async getAnalytics(month, year) {
    const res = await api.get('/dashboard/analytics', {
      params: { month, year }
    });
    return res.data;
  },

  async getSuggestions(month, year) {
    const res = await api.get('/dashboard/suggestions', {
      params: { month, year }
    });
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/profile', profileData);
    return res.data;
  },

  async deleteAccount() {
    const res = await api.delete('/profile');
    return res.data;
  }
};
