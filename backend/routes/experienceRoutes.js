const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { protectAdmin } = require('../middleware/auth');
const { validateExperience } = require('../middleware/validator');

router.get('/', experienceController.getAllExperience.bind(experienceController));
router.get('/:id', experienceController.getExperienceById.bind(experienceController));
router.post('/', protectAdmin, validateExperience, experienceController.createExperience.bind(experienceController));
router.put('/:id', protectAdmin, validateExperience, experienceController.updateExperience.bind(experienceController));
router.delete('/:id', protectAdmin, experienceController.deleteExperience.bind(experienceController));

module.exports = router;
