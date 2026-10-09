const certificationsService = require('../services/certificationsService');

class CertificationsController {
  async getAllCertifications(req, res, next) {
    try {
      const data = await certificationsService.getAllCertifications();
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getCertificationById(req, res, next) {
    try {
      const data = await certificationsService.getCertificationById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async createCertification(req, res, next) {
    try {
      const data = await certificationsService.createCertification(req.body);
      res.status(201).json({
        success: true,
        message: 'Certification created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCertification(req, res, next) {
    try {
      const data = await certificationsService.updateCertification(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Certification updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCertification(req, res, next) {
    try {
      await certificationsService.deleteCertification(req.params.id);
      res.status(200).json({
        success: true,
        message: `Certification '${req.params.id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CertificationsController();
