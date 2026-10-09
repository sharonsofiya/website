const socialLinksService = require('../services/socialLinksService');

class SocialLinksController {
  async getAllSocialLinks(req, res, next) {
    try {
      const data = await socialLinksService.getAllSocialLinks();
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await socialLinksService.getById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async createSocialLink(req, res, next) {
    try {
      const data = await socialLinksService.createSocialLink(req.body);
      res.status(201).json({
        success: true,
        message: 'Social link created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateSocialLink(req, res, next) {
    try {
      const data = await socialLinksService.updateSocialLink(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Social link updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteSocialLink(req, res, next) {
    try {
      await socialLinksService.deleteSocialLink(req.params.id);
      res.status(200).json({
        success: true,
        message: `Social link '${req.params.id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SocialLinksController();
