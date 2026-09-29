/**
 * Validator functions for monthly budget operations
 */

function validateSetBudget(req) {
  const errors = [];
  const { month, year, amount } = req.body || {};

  const numMonth = parseInt(month, 10);
  if (month === undefined || isNaN(numMonth) || numMonth < 1 || numMonth > 12) {
    errors.push('Budget month must be an integer between 1 and 12.');
  }

  const numYear = parseInt(year, 10);
  if (year === undefined || isNaN(numYear) || numYear < 2020 || numYear > 2100) {
    errors.push('Budget year must be a valid 4-digit year (2020-2100).');
  }

  const numAmount = parseFloat(amount);
  if (amount === undefined || isNaN(numAmount) || numAmount <= 0) {
    errors.push('Budget amount must be a positive number greater than 0.');
  } else if (numAmount > 10000000) {
    errors.push('Budget amount exceeds permissible limit.');
  }

  return errors;
}

module.exports = {
  validateSetBudget
};
