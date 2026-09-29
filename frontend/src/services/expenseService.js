import api from './api';

export const expenseService = {
  async getExpenses(params = {}) {
    const res = await api.get('/expenses', { params });
    return res.data;
  },

  async getExpenseById(id) {
    const res = await api.get(`/expenses/${id}`);
    return res.data;
  },

  async createExpense(expenseData) {
    const res = await api.post('/expenses', expenseData);
    return res.data;
  },

  async updateExpense(id, expenseData) {
    const res = await api.put(`/expenses/${id}`, expenseData);
    return res.data;
  },

  async deleteExpense(id) {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/categories');
    return res.data;
  }
};
