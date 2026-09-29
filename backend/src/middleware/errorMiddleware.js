const apiResponse = require('../utils/apiResponse');
const env = require('../config/env');

/**
 * 404 Not Found Middleware for unmatched routes
 */
function notFoundHandler(req, res, next) {
  return apiResponse.error(
    res,
    `Route ${req.method} ${req.originalUrl} not found on this server.`,
    'RESOURCE_NOT_FOUND',
    404
  );
}

/**
 * Centralized Global Error Handler
 */
function errorHandler(err, req, res, next) {
  // Avoid logging sensitive request body info in production
  if (env.isDevelopment) {
    console.error('Unhandled Application Error:', err);
  } else {
    console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'An unexpected internal server error occurred.';

  // Handle specific common error types
  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload received.';
  } else if (err.code === '23505') {
    // PostgreSQL unique violation
    statusCode = 409;
    message = 'A record with this unique identifier already exists.';
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Authentication token is invalid or missing.';
  }

  const errorDetails = env.isDevelopment ? err.stack : undefined;

  return apiResponse.error(
    res,
    message,
    errorDetails,
    statusCode
  );
}

module.exports = {
  notFoundHandler,
  errorHandler
};
