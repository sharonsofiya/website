const projectsService = require('../services/projectsService');

class ProjectsController {
  async getProjects(req, res, next) {
    try {
      const { category, search, featured, page, limit } = req.query;
      const result = await projectsService.getProjects({ category, search, featured, page, limit });
      res.status(200).json({
        success: true,
        count: result.projects.length,
        total: result.total,
        pagination: result.pagination,
        data: result.projects
      });
    } catch (err) {
      next(err);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const data = await projectsService.getProjectById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async createProject(req, res, next) {
    try {
      const data = await projectsService.createProject(req.body);
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProject(req, res, next) {
    try {
      const data = await projectsService.updateProject(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProject(req, res, next) {
    try {
      await projectsService.deleteProject(req.params.id);
      res.status(200).json({
        success: true,
        message: `Project '${req.params.id}' deleted successfully`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProjectsController();
