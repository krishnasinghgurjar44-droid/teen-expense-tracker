const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// All dashboard routes require authentication
router.use(authMiddleware);

router.get('/summary', dashboardController.getSummary);
router.get('/recent', dashboardController.getRecent);
router.get('/analytics', dashboardController.getAnalytics);
router.get('/suggestions', dashboardController.getSuggestions);

module.exports = router;
