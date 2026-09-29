/**
 * Currency, Date and Formatting utilities for TeenSpend
 */

/**
 * Format a number as Indian Rupee (INR - ₹)
 * @param {number|string} amount
 * @param {boolean} [showDecimals=false]
 * @returns {string} e.g. "₹6,250" or "₹6,250.50"
 */
export function formatINR(amount, showDecimals = false) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '₹0';

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  });

  return formatter.format(num);
}

/**
 * Format a date string (YYYY-MM-DD or ISO) into readable UK/Indian standard: "28 Sep 2026"
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Dynamic friendly time greeting based on local time
 * @returns {string} "Good morning", "Good afternoon", "Good evening"
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Calculate safe percentage without NaN or Infinity
 * @param {number} part
 * @param {number} total
 * @returns {number}
 */
export function calculatePercentage(part, total) {
  if (!total || total <= 0) return 0;
  return Math.min(1000, Math.round((part / total) * 100));
}
