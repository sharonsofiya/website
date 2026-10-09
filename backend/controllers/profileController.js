const profileService = require('../services/profileService');

class ProfileController {
  async getProfile(req, res, next) {
    try {
      const data = await profileService.getProfile();
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const data = await profileService.updateProfile(req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProfileController();
