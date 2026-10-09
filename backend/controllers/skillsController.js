const skillsService = require('../services/skillsService');

class SkillsController {
  async getAllSkills(req, res, next) {
    try {
      const { category } = req.query;
      const data = await skillsService.getAllSkills(category);
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getSkillById(req, res, next) {
    try {
      const data = await skillsService.getSkillById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async createSkill(req, res, next) {
    try {
      const data = await skillsService.createSkill(req.body);
      res.status(201).json({
        success: true,
        message: 'Skill created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateSkill(req, res, next) {
    try {
      const data = await skillsService.updateSkill(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Skill updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteSkill(req, res, next) {
    try {
      await skillsService.deleteSkill(req.params.id);
      res.status(200).json({
        success: true,
        message: `Skill '${req.params.id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SkillsController();
