/**
 * Validator functions for expense operations
 */

const VALID_PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Other'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validateCreateExpense(req) {
  const errors = [];
  const { title, amount, category_id, expense_date, payment_method, description } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Expense title is required.');
  } else if (title.trim().length > 150) {
    errors.push('Expense title cannot exceed 150 characters.');
  }

  const numAmount = parseFloat(amount);
  if (amount === undefined || isNaN(numAmount) || numAmount <= 0) {
    errors.push('Expense amount must be a positive number greater than 0.');
  } else if (numAmount > 10000000) {
    errors.push('Amount exceeds maximum permissible limit.');
  }

  if (!category_id || typeof category_id !== 'string') {
    errors.push('A valid category ID is required.');
  }

  if (!expense_date || typeof expense_date !== 'string' || !DATE_REGEX.test(expense_date)) {
    errors.push('A valid date in YYYY-MM-DD format is required.');
  } else {
    const d = new Date(expense_date);
    if (isNaN(d.getTime())) {
      errors.push('The provided expense date is invalid.');
    }
  }

  if (!payment_method || !VALID_PAYMENT_METHODS.includes(payment_method)) {
    errors.push(`Payment method must be one of: ${VALID_PAYMENT_METHODS.join(', ')}.`);
  }

  if (description && typeof description === 'string' && description.length > 500) {
    errors.push('Description cannot exceed 500 characters.');
  }

  return errors;
}

function validateUpdateExpense(req) {
  const errors = [];
  const { title, amount, category_id, expense_date, payment_method, description } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Expense title cannot be empty.');
    } else if (title.trim().length > 150) {
      errors.push('Expense title cannot exceed 150 characters.');
    }
  }

  if (amount !== undefined) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.push('Expense amount must be a positive number greater than 0.');
    } else if (numAmount > 10000000) {
      errors.push('Amount exceeds maximum permissible limit.');
    }
  }

  if (category_id !== undefined && (!category_id || typeof category_id !== 'string')) {
    errors.push('A valid category ID is required.');
  }

  if (expense_date !== undefined) {
    if (typeof expense_date !== 'string' || !DATE_REGEX.test(expense_date)) {
      errors.push('Expense date must be in YYYY-MM-DD format.');
    } else {
      const d = new Date(expense_date);
      if (isNaN(d.getTime())) {
        errors.push('The provided expense date is invalid.');
      }
    }
  }

  if (payment_method !== undefined && !VALID_PAYMENT_METHODS.includes(payment_method)) {
    errors.push(`Payment method must be one of: ${VALID_PAYMENT_METHODS.join(', ')}.`);
  }

  if (description !== undefined && description !== null && typeof description === 'string' && description.length > 500) {
    errors.push('Description cannot exceed 500 characters.');
  }

  return errors;
}

module.exports = {
  validateCreateExpense,
  validateUpdateExpense
};
