const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protectAdmin } = require('../middleware/auth');

router.post('/login', authController.login.bind(authController));
router.get('/verify', authController.verify.bind(authController));
router.post('/reset', protectAdmin, authController.resetData.bind(authController));

module.exports = router;
