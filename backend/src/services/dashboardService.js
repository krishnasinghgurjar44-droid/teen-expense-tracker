const expenseModel = require('../models/expenseModel');
const budgetModel = require('../models/budgetModel');
const categoryModel = require('../models/categoryModel');
const suggestionService = require('./suggestionService');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function getMonthDateRange(year, month) {
  const paddedMonth = String(month).padStart(2, '0');
  const startDate = `${year}-${paddedMonth}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${paddedMonth}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate, totalDays: lastDay };
}

function getPreviousMonth(year, month) {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

const dashboardService = {
  /**
   * Get high-level summary cards and metrics for the dashboard
   * @param {string} userId - User UUID
   * @param {number} [targetMonth]
   * @param {number} [targetYear]
   */
  async getSummary(userId, targetMonth, targetYear) {
    const now = new Date();
    const month = targetMonth ? parseInt(targetMonth, 10) : now.getMonth() + 1;
    const year = targetYear ? parseInt(targetYear, 10) : now.getFullYear();

    const { startDate, endDate, totalDays } = getMonthDateRange(year, month);
    const expenses = await expenseModel.getByDateRange(userId, startDate, endDate);
    const budgetRecord = await budgetModel.findByUserAndPeriod(userId, month, year);

    // Calculate previous month expenses for trend comparison
    const prev = getPreviousMonth(year, month);
    const prevRange = getMonthDateRange(prev.year, prev.month);
    const prevExpenses = await expenseModel.getByDateRange(userId, prevRange.startDate, prevRange.endDate);
    const prevSpent = prevExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    // Current month calculations
    const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const monthlyBudget = budgetRecord ? parseFloat(budgetRecord.amount) : 0;
    const remainingBudget = monthlyBudget > 0 ? Math.max(0, monthlyBudget - totalSpent) : 0;
    const budgetUsagePercentage = monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : 0;
    const transactionCount = expenses.length;

    // Calculate Days Elapsed for daily average
    let daysElapsed = totalDays;
    if (year === now.getFullYear() && month === now.getMonth() + 1) {
      daysElapsed = Math.max(1, now.getDate());
    }
    const averageDailySpending = Math.round(totalSpent / daysElapsed);

    // Category breakdown and finding Highest Category
    const categoryMap = {};
    for (const exp of expenses) {
      const catId = exp.category_id;
      const catName = exp.categories ? exp.categories.name : 'Other';
      const catIcon = exp.categories ? exp.categories.icon : '📦';
      const catColor = exp.categories ? exp.categories.color : '#6366f1';

      if (!categoryMap[catId]) {
        categoryMap[catId] = {
          id: catId,
          name: catName,
          icon: catIcon,
          color: catColor,
          amount: 0,
          count: 0
        };
      }
      categoryMap[catId].amount += parseFloat(exp.amount);
      categoryMap[catId].count += 1;
    }

    const categoryList = Object.values(categoryMap).map((cat) => ({
      ...cat,
      amount: Math.round(cat.amount * 100) / 100,
      percentage: totalSpent > 0 ? Math.round((cat.amount / totalSpent) * 100) : 0
    }));

    categoryList.sort((a, b) => b.amount - a.amount);
    const highestSpendingCategory = categoryList[0] || null;

    // Largest single expense
    let largestExpense = null;
    if (expenses.length > 0) {
      const sortedByAmount = [...expenses].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
      const top = sortedByAmount[0];
      largestExpense = {
        id: top.id,
        title: top.title,
        amount: parseFloat(top.amount),
        expense_date: top.expense_date,
        categoryName: top.categories ? top.categories.name : 'Other',
        categoryIcon: top.categories ? top.categories.icon : '📦'
      };
    }

    // Month comparison
    const spentDifference = Math.round((totalSpent - prevSpent) * 100) / 100;
    let percentageChange = null;
    let trend = 'neutral';
    if (prevSpent > 0) {
      percentageChange = Math.round(((totalSpent - prevSpent) / prevSpent) * 100);
      trend = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'neutral';
    }

    return {
      period: {
        month,
        monthName: MONTH_NAMES[month - 1],
        year,
        startDate,
        endDate,
        daysElapsed,
        totalDays
      },
      budget: {
        monthlyBudget,
        totalSpent: Math.round(totalSpent * 100) / 100,
        remainingBudget: Math.round(remainingBudget * 100) / 100,
        budgetUsagePercentage,
        isExceeded: monthlyBudget > 0 && totalSpent > monthlyBudget
      },
      metrics: {
        transactionCount,
        averageDailySpending,
        highestSpendingCategory,
        largestExpense
      },
      comparison: {
        previousMonthSpent: Math.round(prevSpent * 100) / 100,
        spentDifference,
        percentageChange,
        trend
      }
    };
  },

  /**
   * Get latest recent transactions for dashboard
   * @param {string} userId - User UUID
   * @param {number} [limit=5]
   */
  async getRecent(userId, limit = 5) {
    return await expenseModel.getRecentByUser(userId, limit);
  },

  /**
   * Get comprehensive data for graphical analytics charts
   * @param {string} userId - User UUID
   * @param {number} [targetMonth]
   * @param {number} [targetYear]
   */
  async getAnalytics(userId, targetMonth, targetYear) {
    const now = new Date();
    const month = targetMonth ? parseInt(targetMonth, 10) : now.getMonth() + 1;
    const year = targetYear ? parseInt(targetYear, 10) : now.getFullYear();

    const { startDate, endDate, totalDays } = getMonthDateRange(year, month);
    const expenses = await expenseModel.getByDateRange(userId, startDate, endDate);
    const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    // 1. Category Spending Donut Chart & Comparison Bar Chart
    const allCategories = await categoryModel.getAll();
    const categoryMap = {};

    allCategories.forEach((c) => {
      categoryMap[c.id] = {
        name: c.name,
        icon: c.icon,
        color: c.color || '#6366f1',
        amount: 0,
        count: 0
      };
    });

    expenses.forEach((exp) => {
      const catId = exp.category_id;
      if (categoryMap[catId]) {
        categoryMap[catId].amount += parseFloat(exp.amount);
        categoryMap[catId].count += 1;
      } else {
        const catName = exp.categories?.name || 'Other';
        categoryMap[catId] = {
          name: catName,
          icon: exp.categories?.icon || '📦',
          color: exp.categories?.color || '#64748b',
          amount: parseFloat(exp.amount),
          count: 1
        };
      }
    });

    // Donut chart data (filtered to active categories)
    const categoryDonutData = Object.values(categoryMap)
      .filter((cat) => cat.amount > 0)
      .map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        amount: Math.round(cat.amount * 100) / 100,
        percentage: totalSpent > 0 ? Math.round((cat.amount / totalSpent) * 100) : 0,
        count: cat.count
      }))
      .sort((a, b) => b.amount - a.amount);

    // Category comparison bar chart (all categories or top active)
    const categoryComparisonData = Object.values(categoryMap)
      .map((cat) => ({
        category: cat.name,
        icon: cat.icon,
        amount: Math.round(cat.amount * 100) / 100,
        fill: cat.color
      }))
      .sort((a, b) => b.amount - a.amount);

    // 2. Daily Spending Line Chart
    // Build array for every day of the month (1 to totalDays)
    const dailyMap = {};
    for (let day = 1; day <= totalDays; day++) {
      const paddedDay = String(day).padStart(2, '0');
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${paddedDay}`;
      dailyMap[dateStr] = {
        date: dateStr,
        day,
        label: `${day} ${MONTH_SHORT[month - 1]}`,
        amount: 0,
        count: 0
      };
    }

    expenses.forEach((exp) => {
      const expDate = exp.expense_date;
      if (dailyMap[expDate]) {
        dailyMap[expDate].amount += parseFloat(exp.amount);
        dailyMap[expDate].count += 1;
      }
    });

    const dailySpendingData = Object.values(dailyMap).map((d) => ({
      ...d,
      amount: Math.round(d.amount * 100) / 100
    }));

    // 3. Monthly Spending Trend Bar Chart (Last 6 months)
    const trendPeriods = Array.from({ length: 6 }, (_, index) => {
      const d = new Date(year, month - 6 + index, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      return { month: m, year: y, range: getMonthDateRange(y, m) };
    });

    // Fetch all six months concurrently. The previous implementation awaited each
    // expense and budget query in sequence, making the analytics page very slow
    // when it was connected to Supabase over the network.
    const monthlyTrendData = await Promise.all(
      trendPeriods.map(async ({ month: trendMonth, year: trendYear, range }) => {
        const [monthExpenses, monthBudget] = await Promise.all([
          expenseModel.getByDateRange(userId, range.startDate, range.endDate),
          budgetModel.findByUserAndPeriod(userId, trendMonth, trendYear)
        ]);
        const spent = monthExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

        return {
          month: trendMonth,
          year: trendYear,
          label: `${MONTH_SHORT[trendMonth - 1]} '${String(trendYear).slice(-2)}`,
          spent: Math.round(spent * 100) / 100,
          budget: monthBudget ? parseFloat(monthBudget.amount) : 0
        };
      })
    );

    // 4. Payment Method Breakdown
    const paymentMap = { Cash: 0, UPI: 0, 'Debit Card': 0, Other: 0 };
    expenses.forEach((exp) => {
      const method = exp.payment_method || 'Other';
      paymentMap[method] = (paymentMap[method] || 0) + parseFloat(exp.amount);
    });

    const paymentMethodData = Object.entries(paymentMap).map(([method, amt]) => ({
      name: method,
      amount: Math.round(amt * 100) / 100,
      percentage: totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0
    }));

    return {
      month,
      year,
      totalSpent: Math.round(totalSpent * 100) / 100,
      categoryDonut: categoryDonutData,
      categoryComparison: categoryComparisonData,
      dailySpending: dailySpendingData,
      monthlyTrend: monthlyTrendData,
      paymentMethods: paymentMethodData
    };
  },

  /**
   * Get deterministic financial suggestions for the user
   * @param {string} userId - User UUID
   * @param {number} [targetMonth]
   * @param {number} [targetYear]
   */
  async getSuggestions(userId, targetMonth, targetYear) {
    const summary = await this.getSummary(userId, targetMonth, targetYear);
    const { startDate, endDate } = getMonthDateRange(summary.period.year, summary.period.month);
    const expenses = await expenseModel.getByDateRange(userId, startDate, endDate);

    // Build category spending array
    const catMap = {};
    expenses.forEach((e) => {
      const name = e.categories ? e.categories.name : 'Other';
      const icon = e.categories ? e.categories.icon : '📦';
      if (!catMap[name]) {
        catMap[name] = { name, icon, amount: 0, count: 0 };
      }
      catMap[name].amount += parseFloat(e.amount);
      catMap[name].count += 1;
    });

    const total = summary.budget.totalSpent;
    const categorySpending = Object.values(catMap).map((c) => ({
      ...c,
      percentage: total > 0 ? Math.round((c.amount / total) * 100) : 0
    }));

    return suggestionService.generateSuggestions({
      monthlyBudget: summary.budget.monthlyBudget,
      totalSpent: summary.budget.totalSpent,
      categorySpending,
      transactions: expenses,
      previousMonthSpent: summary.comparison.previousMonthSpent
    });
  }
};

module.exports = dashboardService;
