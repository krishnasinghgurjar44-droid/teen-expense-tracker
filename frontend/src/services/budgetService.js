import api from './api';

export const budgetService = {
  async getBudget(month, year) {
    const res = await api.get('/budget', {
      params: { month, year }
    });
    return res.data;
  },

  async setBudget(budgetData) {
    const res = await api.post('/budget', budgetData);
    return res.data;
  },

  async getHistory() {
    const res = await api.get('/budget/history');
    return res.data;
  }
};
