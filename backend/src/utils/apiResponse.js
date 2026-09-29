/**
 * Standard API Response utilities for consistent REST responses across the app
 */

const apiResponse = {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {*} data - Payload data
   * @param {string} message - Human-readable success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  success: (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  /**
   * Paginated success response
   * @param {Object} res - Express response object
   * @param {Array} data - Current page items
   * @param {Object} pagination - { page, limit, total, totalPages }
   * @param {string} message - Human-readable success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  paginated: (res, data = [], pagination = {}, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination
    });
  },

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Human-readable error message
   * @param {*} error - Detailed error or validation errors list
   * @param {number} statusCode - HTTP status code (default: 500)
   */
  error: (res, message = 'Internal Server Error', error = null, statusCode = 500) => {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(error && { error })
    });
  }
};

module.exports = apiResponse;
