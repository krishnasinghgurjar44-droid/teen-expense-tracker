const budgetService = require('../services/budgetService');
const apiResponse = require('../utils/apiResponse');

const budgetController = {
  /**
   * Get budget information for a specific month and year
   */
  async get(req, res, next) {
    try {
      const { month, year } = req.query;
      const budgetData = await budgetService.getBudget(req.user.id, month, year);
      return apiResponse.success(res, budgetData, 'Budget retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Set or update monthly budget
   */
  async set(req, res, next) {
    try {
      const { month, year, amount } = req.body;
      const budgetData = await budgetService.setBudget(req.user.id, {
        month,
        year,
        amount
      });
      return apiResponse.success(
        res,
        budgetData,
        'Monthly budget configured successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get budget history across previous months
   */
  async getHistory(req, res, next) {
    try {
      const history = await budgetService.getHistory(req.user.id);
      return apiResponse.success(
        res,
        history,
        'Budget history retrieved successfully.'
      );
    } catch (error) {
      next(error);
    }
  }
};

module.exports = budgetController;
