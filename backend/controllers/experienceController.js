const experienceService = require('../services/experienceService');

class ExperienceController {
  async getAllExperience(req, res, next) {
    try {
      const data = await experienceService.getAllExperience();
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getExperienceById(req, res, next) {
    try {
      const data = await experienceService.getExperienceById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async createExperience(req, res, next) {
    try {
      const data = await experienceService.createExperience(req.body);
      res.status(201).json({
        success: true,
        message: 'Experience created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateExperience(req, res, next) {
    try {
      const data = await experienceService.updateExperience(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Experience updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteExperience(req, res, next) {
    try {
      await experienceService.deleteExperience(req.params.id);
      res.status(200).json({
        success: true,
        message: `Experience entry '${req.params.id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ExperienceController();
