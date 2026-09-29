const categoryModel = require('../models/categoryModel');
const apiResponse = require('../utils/apiResponse');

const categoryController = {
  /**
   * Get all expense categories
   */
  async getAll(req, res, next) {
    try {
      const categories = await categoryModel.getAll();
      return apiResponse.success(res, categories, 'Categories retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
