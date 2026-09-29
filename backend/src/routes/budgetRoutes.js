const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { validateSetBudget } = require('../validators/budgetValidator');

// All budget routes require authentication
router.use(authMiddleware);

router.get('/', budgetController.get);
router.post('/', validate(validateSetBudget), budgetController.set);
router.put('/', validate(validateSetBudget), budgetController.set);
router.get('/history', budgetController.getHistory);

module.exports = router;
