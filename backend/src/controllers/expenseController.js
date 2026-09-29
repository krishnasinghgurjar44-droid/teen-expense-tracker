const expenseService = require('../services/expenseService');
const apiResponse = require('../utils/apiResponse');

const expenseController = {
  /**
   * Create a new expense
   */
  async create(req, res, next) {
    try {
      const expense = await expenseService.createExpense(req.user.id, req.body);
      return apiResponse.success(
        res,
        expense,
        'Expense recorded successfully.',
        201
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all expenses with filtering, search, and pagination
   */
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 15,
        category,
        paymentMethod,
        search,
        from,
        to,
        minAmount,
        maxAmount,
        sort = 'newest'
      } = req.query;

      const result = await expenseService.getExpenses(req.user.id, {
        page,
        limit,
        category,
        paymentMethod,
        search,
        from,
        to,
        minAmount,
        maxAmount,
        sort
      });

      return apiResponse.paginated(
        res,
        result.data,
        result.pagination,
        'Expenses retrieved successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a single expense by ID
   */
  async getById(req, res, next) {
    try {
      const expense = await expenseService.getExpenseById(req.params.id, req.user.id);
      return apiResponse.success(res, expense, 'Expense details retrieved.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an existing expense
   */
  async update(req, res, next) {
    try {
      const updatedExpense = await expenseService.updateExpense(
        req.params.id,
        req.user.id,
        req.body
      );
      return apiResponse.success(
        res,
        updatedExpense,
        'Expense updated successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete an expense
   */
  async delete(req, res, next) {
    try {
      await expenseService.deleteExpense(req.params.id, req.user.id);
      return apiResponse.success(
        res,
        null,
        'Expense deleted successfully.'
      );
    } catch (error) {
      next(error);
    }
  }
};

module.exports = expenseController;
