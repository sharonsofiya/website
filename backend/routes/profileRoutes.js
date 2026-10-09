const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', profileController.getProfile.bind(profileController));
router.put('/', protectAdmin, profileController.updateProfile.bind(profileController));

module.exports = router;
