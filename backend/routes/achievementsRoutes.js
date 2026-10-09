const express = require('express');
const router = express.Router();
const achievementsController = require('../controllers/achievementsController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', achievementsController.getAllAchievements.bind(achievementsController));
router.get('/:id', achievementsController.getAchievementById.bind(achievementsController));
router.post('/', protectAdmin, achievementsController.createAchievement.bind(achievementsController));
router.put('/:id', protectAdmin, achievementsController.updateAchievement.bind(achievementsController));
router.delete('/:id', protectAdmin, achievementsController.deleteAchievement.bind(achievementsController));

module.exports = router;
