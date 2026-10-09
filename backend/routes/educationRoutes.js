const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', educationController.getAllEducation.bind(educationController));
router.get('/:id', educationController.getEducationById.bind(educationController));
router.post('/', protectAdmin, educationController.createEducation.bind(educationController));
router.put('/:id', protectAdmin, educationController.updateEducation.bind(educationController));
router.delete('/:id', protectAdmin, educationController.deleteEducation.bind(educationController));

module.exports = router;
