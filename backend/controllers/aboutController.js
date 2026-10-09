const aboutService = require('../services/aboutService');

class AboutController {
  async getAbout(req, res, next) {
    try {
      const data = await aboutService.getAbout();
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateAbout(req, res, next) {
    try {
      const data = await aboutService.updateAbout(req.body);
      res.status(200).json({
        success: true,
        message: 'About section updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AboutController();
