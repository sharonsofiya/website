const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', aboutController.getAbout.bind(aboutController));
router.put('/', protectAdmin, aboutController.updateAbout.bind(aboutController));

module.exports = router;
