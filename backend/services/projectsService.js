const { Project } = require('../models');

class ProjectsService {
  async getProjects({ category, search, featured, page, limit }) {
    let projects = await Project.findAll();

    // Category filter
    if (category && category.toLowerCase() !== 'all') {
      projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Featured filter
    if (featured !== undefined) {
      const isFeatured = featured === 'true' || featured === true;
      projects = projects.filter(p => p.featured === isFeatured);
    }

    // Search query filter
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(term)))
      );
    }

    // Sort by latest createdAt first
    projects.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    // Pagination
    const total = projects.length;
    let paginatedProjects = projects;
    let pagination = null;

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      paginatedProjects = projects.slice(startIndex, endIndex);

      pagination = {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
        hasNext: endIndex < total
      };
    }

    return {
      projects: paginatedProjects,
      total,
      pagination
    };
  }

  async getProjectById(id) {
    const project = await Project.findById(id);
    if (!project) {
      throw { status: 404, message: `Project with ID '${id}' was not found.` };
    }
    return project;
  }

  async createProject(data) {
    const newProject = {
      title: data.title,
      description: data.description,
      image: data.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      category: data.category || 'Web',
      technologies: Array.isArray(data.technologies) ? data.technologies : (data.technologies ? data.technologies.split(',').map(t => t.trim()) : []),
      githubUrl: data.githubUrl || 'https://github.com',
      liveUrl: data.liveUrl || 'https://example.com',
      featured: Boolean(data.featured),
      features: Array.isArray(data.features) ? data.features : (data.features ? [data.features] : []),
      createdAt: data.createdAt || new Date().toISOString()
    };
    return await Project.create(newProject);
  }

  async updateProject(id, data) {
    await this.getProjectById(id);
    if (data.technologies && typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(t => t.trim());
    }
    if (data.features && typeof data.features === 'string') {
      data.features = data.features.split('\n').map(f => f.trim()).filter(Boolean);
    }
    return await Project.update(id, data);
  }

  async deleteProject(id) {
    await this.getProjectById(id);
    return await Project.delete(id);
  }
}

module.exports = new ProjectsService();
