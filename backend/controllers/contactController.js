const contactService = require('../services/contactService');

class ContactController {
  async submitContact(req, res, next) {
    try {
      const result = await contactService.sendMessage(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAllMessages(req, res, next) {
    try {
      const data = await contactService.getAllMessages();
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const data = await contactService.markAsRead(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Message marked as read',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      await contactService.deleteMessage(req.params.id);
      res.status(200).json({
        success: true,
        message: `Message '${req.params.id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContactController();
