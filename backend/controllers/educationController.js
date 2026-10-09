const educationService = require('../services/educationService');

class EducationController {
  async getAllEducation(req, res, next) {
    try {
      const data = await educationService.getAllEducation();
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getEducationById(req, res, next) {
    try {
      const data = await educationService.getEducationById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async createEducation(req, res, next) {
    try {
      const data = await educationService.createEducation(req.body);
      res.status(201).json({
        success: true,
        message: 'Education entry created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateEducation(req, res, next) {
    try {
      const data = await educationService.updateEducation(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Education entry updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteEducation(req, res, next) {
    try {
      await educationService.deleteEducation(req.params.id);
      res.status(200).json({
        success: true,
        message: `Education entry '${req.params.id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EducationController();
