const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  validateRegister,
  validateLogin,
  validateChangePassword
} = require('../validators/authValidator');

// Public routes
router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);
router.post('/change-password', authMiddleware, validate(validateChangePassword), authController.changePassword);

module.exports = router;
