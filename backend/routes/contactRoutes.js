const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/auth');
const { validateContact } = require('../middleware/validator');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, validateContact, contactController.submitContact.bind(contactController));
router.get('/', protectAdmin, contactController.getAllMessages.bind(contactController));
router.patch('/:id/read', protectAdmin, contactController.markAsRead.bind(contactController));
router.delete('/:id', protectAdmin, contactController.deleteMessage.bind(contactController));

module.exports = router;
