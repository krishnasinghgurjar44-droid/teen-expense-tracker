const dashboardService = require('../services/dashboardService');
const apiResponse = require('../utils/apiResponse');

const dashboardController = {
  /**
   * Get main dashboard summary cards and key financial metrics
   */
  async getSummary(req, res, next) {
    try {
      const { month, year } = req.query;
      const summary = await dashboardService.getSummary(req.user.id, month, year);
      return apiResponse.success(res, summary, 'Dashboard summary loaded.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get recent transactions for the dashboard quick list
   */
  async getRecent(req, res, next) {
    try {
      const limit = parseInt(req.query.limit || 5, 10);
      const recent = await dashboardService.getRecent(req.user.id, limit);
      return apiResponse.success(res, recent, 'Recent transactions fetched.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get analytics chart datasets (Category Donut, Daily Line, Monthly Trend Bar, Category Comparison)
   */
  async getAnalytics(req, res, next) {
    try {
      const { month, year } = req.query;
      const analytics = await dashboardService.getAnalytics(req.user.id, month, year);
      return apiResponse.success(res, analytics, 'Analytics data retrieved.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get deterministic financial education suggestions
   */
  async getSuggestions(req, res, next) {
    try {
      const { month, year } = req.query;
      const suggestions = await dashboardService.getSuggestions(req.user.id, month, year);
      return apiResponse.success(res, suggestions, 'Smart spending suggestions generated.');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
