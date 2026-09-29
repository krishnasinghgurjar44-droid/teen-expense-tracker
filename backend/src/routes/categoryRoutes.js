const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Categories can be accessed publicly or by authenticated users
router.get('/', categoryController.getAll);

module.exports = router;
