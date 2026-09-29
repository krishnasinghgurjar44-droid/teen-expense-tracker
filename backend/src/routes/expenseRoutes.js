const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  validateCreateExpense,
  validateUpdateExpense
} = require('../validators/expenseValidator');

// All expense routes require authentication
router.use(authMiddleware);

router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.post('/', validate(validateCreateExpense), expenseController.create);
router.put('/:id', validate(validateUpdateExpense), expenseController.update);
router.delete('/:id', expenseController.delete);

module.exports = router;
