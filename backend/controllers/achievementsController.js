const achievementsService = require('../services/achievementsService');

class AchievementsController {
  async getAllAchievements(req, res, next) {
    try {
      const data = await achievementsService.getAllAchievements();
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getAchievementById(req, res, next) {
    try {
      const data = await achievementsService.getAchievementById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async createAchievement(req, res, next) {
    try {
      const data = await achievementsService.createAchievement(req.body);
      res.status(201).json({
        success: true,
        message: 'Achievement created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateAchievement(req, res, next) {
    try {
      const data = await achievementsService.updateAchievement(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Achievement updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteAchievement(req, res, next) {
    try {
      await achievementsService.deleteAchievement(req.params.id);
      res.status(200).json({
        success: true,
        message: `Achievement '${req.params.id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AchievementsController();
