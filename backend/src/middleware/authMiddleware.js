const { verifyToken } = require('../utils/jwt');
const userModel = require('../models/userModel');
const apiResponse = require('../utils/apiResponse');

/**
 * Authentication middleware that verifies JWT and injects user identity into req.user
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return apiResponse.error(
        res,
        'Access denied. No authentication token provided.',
        'MISSING_TOKEN',
        401
      );
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return apiResponse.error(
          res,
          'Your session has expired. Please log in again.',
          'TOKEN_EXPIRED',
          401
        );
      }
      return apiResponse.error(
        res,
        'Invalid authentication token.',
        'INVALID_TOKEN',
        401
      );
    }

    if (!decoded || !decoded.id) {
      return apiResponse.error(
        res,
        'Invalid token payload.',
        'MALFORMED_TOKEN',
        401
      );
    }

    // Verify user exists in database
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return apiResponse.error(
        res,
        'User account associated with this token no longer exists.',
        'USER_NOT_FOUND',
        401
      );
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error.message);
    return apiResponse.error(
      res,
      'Authentication failed.',
      'AUTH_ERROR',
      401
    );
  }
}

module.exports = authMiddleware;
