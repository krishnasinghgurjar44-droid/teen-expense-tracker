const userModel = require('../models/userModel');
const apiResponse = require('../utils/apiResponse');

const profileController = {
  /**
   * Get user profile details
   */
  async getProfile(req, res, next) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return apiResponse.error(res, 'User not found', 'USER_NOT_FOUND', 404);
      }
      return apiResponse.success(res, user, 'Profile retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update profile information (e.g. name)
   */
  async updateProfile(req, res, next) {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return apiResponse.error(
          res,
          'Name is required and must be at least 2 characters long.',
          'INVALID_NAME',
          422
        );
      }

      const updated = await userModel.update(req.user.id, {
        name: name.trim(),
        updated_at: new Date().toISOString()
      });

      return apiResponse.success(res, updated, 'Profile updated successfully.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Permanently delete user account and all associated data
   */
  async deleteAccount(req, res, next) {
    try {
      await userModel.deleteById(req.user.id);
      return apiResponse.success(
        res,
        null,
        'Your account and all associated data have been permanently removed.'
      );
    } catch (error) {
      next(error);
    }
  }
};

module.exports = profileController;
