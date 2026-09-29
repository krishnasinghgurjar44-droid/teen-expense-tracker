const expenseModel = require('../models/expenseModel');
const categoryModel = require('../models/categoryModel');

const expenseService = {
  /**
   * Create an expense
   * @param {string} userId - User UUID
   * @param {Object} data - Expense payload
   * @returns {Promise<Object>}
   */
  async createExpense(userId, data) {
    // Verify category exists
    const category = await categoryModel.findById(data.category_id);
    if (!category) {
      const error = new Error('The selected category does not exist.');
      error.statusCode = 400;
      throw error;
    }

    const created = await expenseModel.create(userId, data);
    return {
      ...created,
      categories: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color
      }
    };
  },

  /**
   * Get filtered and paginated expenses for a user
   * @param {string} userId - User UUID
   * @param {Object} queryOptions - Filters and pagination params
   * @returns {Promise<Object>}
   */
  async getExpenses(userId, queryOptions) {
    return await expenseModel.findByUserAndFilters(userId, queryOptions);
  },

  /**
   * Get a single expense ensuring ownership
   * @param {string} id - Expense UUID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>}
   */
  async getExpenseById(id, userId) {
    const expense = await expenseModel.findById(id, userId);
    if (!expense) {
      const error = new Error('Expense not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return expense;
  },

  /**
   * Update an existing expense with ownership validation
   * @param {string} id - Expense UUID
   * @param {string} userId - User UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  async updateExpense(id, userId, updates) {
    if (updates.category_id) {
      const category = await categoryModel.findById(updates.category_id);
      if (!category) {
        const error = new Error('The selected category does not exist.');
        error.statusCode = 400;
        throw error;
      }
    }

    const updated = await expenseModel.update(id, userId, updates);
    if (!updated) {
      const error = new Error('Expense not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  },

  /**
   * Delete an expense with ownership validation
   * @param {string} id - Expense UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>}
   */
  async deleteExpense(id, userId) {
    const success = await expenseModel.deleteById(id, userId);
    if (!success) {
      const error = new Error('Expense not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return true;
  }
};

module.exports = expenseService;
