const authService = require('../services/authService');
const apiResponse = require('../utils/apiResponse');

const authController = {
  /**
   * Register a new teenager account
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      return apiResponse.success(
        res,
        result,
        'Welcome to TeenSpend! Your account was created successfully.',
        201
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login with email and password
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return apiResponse.success(
        res,
        result,
        'Logged in successfully. Welcome back!',
        200
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return apiResponse.success(res, user, 'User profile fetched successfully.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Change current user's password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, { currentPassword, newPassword });
      return apiResponse.success(res, null, 'Password updated successfully.');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
