const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');
const { protectAdmin } = require('../middleware/auth');
const { validateSkill } = require('../middleware/validator');

router.get('/', skillsController.getAllSkills.bind(skillsController));
router.get('/:id', skillsController.getSkillById.bind(skillsController));
router.post('/', protectAdmin, validateSkill, skillsController.createSkill.bind(skillsController));
router.put('/:id', protectAdmin, validateSkill, skillsController.updateSkill.bind(skillsController));
router.delete('/:id', protectAdmin, skillsController.deleteSkill.bind(skillsController));

module.exports = router;
