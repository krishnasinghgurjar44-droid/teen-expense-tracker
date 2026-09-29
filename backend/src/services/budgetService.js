const budgetModel = require('../models/budgetModel');
const expenseModel = require('../models/expenseModel');

/**
 * Calculates start and end dates for a given month and year in YYYY-MM-DD
 */
function getMonthDateRange(year, month) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
}

const budgetService = {
  /**
   * Get budget summary and spending status for a specific month/year
   * @param {string} userId - User UUID
   * @param {number} [targetMonth] - Month 1-12
   * @param {number} [targetYear] - Year YYYY
   * @returns {Promise<Object>}
   */
  async getBudget(userId, targetMonth, targetYear) {
    const now = new Date();
    const month = targetMonth ? parseInt(targetMonth, 10) : now.getMonth() + 1;
    const year = targetYear ? parseInt(targetYear, 10) : now.getFullYear();

    const budget = await budgetModel.findByUserAndPeriod(userId, month, year);
    const { startDate, endDate } = getMonthDateRange(year, month);
    const monthlyExpenses = await expenseModel.getByDateRange(userId, startDate, endDate);

    const totalSpent = monthlyExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const budgetAmount = budget ? parseFloat(budget.amount) : 0;
    const remaining = budgetAmount > 0 ? budgetAmount - totalSpent : 0;
    const percentage = budgetAmount > 0 ? Math.round((totalSpent / budgetAmount) * 100) : 0;

    // Status: normal (<70%), caution (70-90%), alert (90-100%), exceeded (>100%)
    let status = 'normal';
    let statusMessage = "You're spending comfortably within your budget.";

    if (budgetAmount === 0) {
      status = 'unbudgeted';
      statusMessage = 'No budget set for this month yet. Set a budget to track spending limits!';
    } else if (percentage > 100) {
      status = 'exceeded';
      statusMessage = "You've exceeded your monthly budget. Review recent expenses to stay balanced!";
    } else if (percentage >= 90) {
      status = 'alert';
      statusMessage = "You're very close to your monthly budget limit. Consider holding off on extra non-essentials.";
    } else if (percentage >= 70) {
      status = 'caution';
      statusMessage = "You're getting close to your monthly budget. Keep an eye on upcoming purchases.";
    }

    return {
      month,
      year,
      budget: budgetAmount,
      spent: Math.round(totalSpent * 100) / 100,
      remaining: Math.round(remaining * 100) / 100,
      percentage,
      status,
      statusMessage,
      budgetId: budget ? budget.id : null,
      updated_at: budget ? budget.updated_at : null
    };
  },

  /**
   * Set or update monthly budget
   * @param {string} userId - User UUID
   * @param {Object} data - { month, year, amount }
   * @returns {Promise<Object>}
   */
  async setBudget(userId, { month, year, amount }) {
    const updatedBudget = await budgetModel.upsert(userId, { month, year, amount });
    // Return full budget summary
    return await this.getBudget(userId, updatedBudget.month, updatedBudget.year);
  },

  /**
   * Get budget history for past months
   * @param {string} userId - User UUID
   * @returns {Promise<Array>}
   */
  async getHistory(userId) {
    const history = await budgetModel.getHistory(userId, 12);
    // Enrich each historical budget with total spent
    const enriched = await Promise.all(
      history.map(async (b) => {
        const { startDate, endDate } = getMonthDateRange(b.year, b.month);
        const expenses = await expenseModel.getByDateRange(userId, startDate, endDate);
        const spent = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
        return {
          id: b.id,
          month: b.month,
          year: b.year,
          budget: parseFloat(b.amount),
          spent: Math.round(spent * 100) / 100,
          remaining: Math.round((parseFloat(b.amount) - spent) * 100) / 100,
          percentage
        };
      })
    );

    return enriched;
  }
};

module.exports = budgetService;
