/**
 * Suggestion Engine for TeenSpend
 * Deterministic, rule-based financial educational suggestions for teenagers.
 * Does NOT provide investment, crypto, loan, or gambling advice.
 */

const suggestionService = {
  /**
   * Generate 2-4 contextual, constructive spending suggestions based on user data
   * @param {Object} context
   * @param {number} context.monthlyBudget
   * @param {number} context.totalSpent
   * @param {Array} context.categorySpending - [{ name, amount, percentage, count, icon }]
   * @param {Array} context.transactions - Array of expense items for the current month
   * @param {number} context.previousMonthSpent
   * @returns {Array<Object>}
   */
  generateSuggestions({
    monthlyBudget = 0,
    totalSpent = 0,
    categorySpending = [],
    transactions = [],
    previousMonthSpent = 0
  }) {
    const suggestions = [];

    // Early return if no transactions exist yet
    if (transactions.length === 0) {
      return [
        {
          id: 'welcome_starter',
          icon: '🌱',
          category: 'Getting Started',
          title: 'Start Your Money Awareness Journey',
          explanation: 'Recording daily expenses, even small ones like ₹20 snacks, helps you build lifelong financial confidence.',
          tip: 'Add your first expense today using the "Add Expense" button!',
          type: 'info'
        },
        {
          id: 'budget_starter',
          icon: '🎯',
          category: 'Budget Goal',
          title: 'Set Your Monthly Pocket Money Budget',
          explanation: 'Setting a realistic monthly spending limit gives you clear boundaries and helps you save for things that matter.',
          tip: 'Visit the Budget page to establish your monthly spending target.',
          type: 'info'
        }
      ];
    }

    // Rule 1: High Budget Usage (>= 90%)
    if (monthlyBudget > 0 && totalSpent / monthlyBudget >= 0.90) {
      const isExceeded = totalSpent > monthlyBudget;
      suggestions.push({
        id: 'rule_budget_high',
        icon: isExceeded ? '🚨' : '⚠️',
        category: 'Budget Alert',
        title: isExceeded ? 'Monthly Budget Exceeded' : 'Close to Budget Limit',
        explanation: isExceeded
          ? "You've spent more than your planned monthly budget. Reviewing optional expenses can help you balance out next month."
          : "You're close to your monthly budget limit. Try limiting optional purchases for the rest of the month.",
        tip: 'Prioritize daily essentials and pause non-urgent shopping until your next allowance or month starts.',
        type: isExceeded ? 'danger' : 'warning'
      });
    }

    // Find category breakdowns
    const foodCat = categorySpending.find((c) => c.name.toLowerCase() === 'food');
    const shoppingCat = categorySpending.find((c) => c.name.toLowerCase() === 'shopping');
    const entertainmentCat = categorySpending.find((c) => c.name.toLowerCase() === 'entertainment');

    // Rule 2: Food Spending (> 30% of total spending)
    if (foodCat && foodCat.percentage >= 30 && foodCat.amount > 300) {
      suggestions.push({
        id: 'rule_food_share',
        icon: '🍔',
        category: 'Food Spending',
        title: 'Food is Your Biggest Outflow',
        explanation: `Food accounted for ₹${Math.round(foodCat.amount).toLocaleString('en-IN')} (${foodCat.percentage}%) of your spending this month. Planning meals and reducing frequent small snacks may help.`,
        tip: 'Try carrying a water bottle and snacks from home before heading to classes or hanging out with friends.',
        type: 'info'
      });
    }

    // Rule 3: Shopping Spending (>= 25% of total spending)
    if (shoppingCat && shoppingCat.percentage >= 25 && shoppingCat.amount > 400) {
      suggestions.push({
        id: 'rule_shopping_high',
        icon: '🛍️',
        category: 'Shopping Habits',
        title: 'High Shopping Purchases',
        explanation: `Shopping makes up ${shoppingCat.percentage}% of your expenses this month. Consider taking time before making non-essential purchases.`,
        tip: 'Practice the 48-hour rule: when tempted to buy something non-essential, wait two full days to see if you still really need it.',
        type: 'info'
      });
    }

    // Rule 4: Entertainment Spending (> 20% of total spending)
    if (entertainmentCat && entertainmentCat.percentage >= 20 && entertainmentCat.amount > 350) {
      suggestions.push({
        id: 'rule_entertainment_limit',
        icon: '🎮',
        category: 'Entertainment',
        title: 'Entertainment Spending',
        explanation: `Entertainment has taken ${entertainmentCat.percentage}% of your total funds this month. Setting a small dedicated limit can reserve money for other needs.`,
        tip: 'Look out for free community events, multiplayer games with friends, or student discounts on outings.',
        type: 'info'
      });
    }

    // Rule 5: Frequent Small Expenses (<= ₹100 transactions)
    const smallTransactions = transactions.filter((t) => parseFloat(t.amount) <= 100);
    const smallExpensesSum = smallTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    if (smallTransactions.length >= 4 && smallExpensesSum >= 200) {
      suggestions.push({
        id: 'rule_frequent_small',
        icon: '🪙',
        category: 'Micro Purchases',
        title: 'Small Expenses Add Up',
        explanation: `You made ${smallTransactions.length} purchases under ₹100, totaling ₹${Math.round(smallExpensesSum).toLocaleString('en-IN')}. Small recurring purchases easily go unnoticed.`,
        tip: 'Reviewing frequent low-value snacks and treats reveals painless ways to save an extra ₹500 every month.',
        type: 'info'
      });
    }

    // Rule 6: Month-to-Month Spending Increase (> 15% increase)
    if (previousMonthSpent > 0 && totalSpent > previousMonthSpent * 1.15) {
      const diff = Math.round(totalSpent - previousMonthSpent);
      suggestions.push({
        id: 'rule_month_increase',
        icon: '📈',
        category: 'Spending Trend',
        title: 'Spending Up From Last Month',
        explanation: `Your spending is ₹${diff.toLocaleString('en-IN')} higher than last month. Check which categories contributed most to the increase.`,
        tip: 'Take 5 minutes on the Analytics tab to compare which specific category grew the most.',
        type: 'warning'
      });
    }

    // Rule 7: Healthy Remaining Budget (< 65% utilized when budget is set)
    if (monthlyBudget > 0 && totalSpent / monthlyBudget <= 0.65 && totalSpent > 0) {
      const remainingAmount = monthlyBudget - totalSpent;
      suggestions.push({
        id: 'rule_budget_healthy',
        icon: '💡',
        category: 'Budget Health',
        title: 'Great Pacing This Month',
        explanation: `You still have ₹${Math.round(remainingAmount).toLocaleString('en-IN')} (${100 - Math.round((totalSpent / monthlyBudget) * 100)}%) of your budget left. Keeping some money unspent gives you flexibility.`,
        tip: 'Consider keeping the remaining amount as your personal emergency cushion for next month!',
        type: 'success'
      });
    }

    // Fallback rule if fewer than 2 suggestions matched
    if (suggestions.length < 2) {
      suggestions.push({
        id: 'rule_consistency_tip',
        icon: '✨',
        category: 'Healthy Habit',
        title: 'Consistency Is Key',
        explanation: 'Logging expenses on the same day they happen keeps your budget accurate and prevents forgotten cash or UPI spends.',
        tip: 'Make it a daily 30-second bedtime habit to log your daily payments.',
        type: 'info'
      });
    }

    // Return the top 2-4 most relevant suggestions
    return suggestions.slice(0, 4);
  }
};

module.exports = suggestionService;
