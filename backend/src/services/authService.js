const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const authService = {
  /**
   * Register a new user
   * @param {Object} data - { name, email, password }
   * @returns {Promise<Object>} { user, token }
   */
  async register({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await userModel.findByEmail(normalizedEmail);
    if (existingUser) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    // Hash password with bcrypt
    const password_hash = await hashPassword(password);

    // Create user in database
    const newUser = await userModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash
    });

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at
      },
      token
    };
  },

  /**
   * Authenticate a user and issue JWT
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} { user, token }
   */
  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Look up user by email
    const user = await userModel.findByEmail(normalizedEmail);
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Compare bcrypt hash
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      token
    };
  },

  /**
   * Get user profile by ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>}
   */
  async getMe(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      const error = new Error('User account not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  /**
   * Change user password
   * @param {string} userId - User UUID
   * @param {Object} payload - { currentPassword, newPassword }
   */
  async changePassword(userId, { currentPassword, newPassword }) {
    const userWithHash = await userModel.findByEmail(
      (await userModel.findById(userId)).email
    );

    if (!userWithHash) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await comparePassword(currentPassword, userWithHash.password_hash);
    if (!isMatch) {
      const error = new Error('The current password you provided is incorrect.');
      error.statusCode = 400;
      throw error;
    }

    const newHash = await hashPassword(newPassword);
    await userModel.updatePassword(userId, newHash);
    return true;
  }
};

module.exports = authService;
