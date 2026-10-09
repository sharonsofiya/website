const express = require('express');
const router = express.Router();
const socialLinksController = require('../controllers/socialLinksController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', socialLinksController.getAllSocialLinks.bind(socialLinksController));
router.get('/:id', socialLinksController.getById.bind(socialLinksController));
router.post('/', protectAdmin, socialLinksController.createSocialLink.bind(socialLinksController));
router.put('/:id', protectAdmin, socialLinksController.updateSocialLink.bind(socialLinksController));
router.delete('/:id', protectAdmin, socialLinksController.deleteSocialLink.bind(socialLinksController));

module.exports = router;
