const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/auth', authController.getAllUsers);

module.exports = router;