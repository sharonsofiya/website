const { Experience } = require('../models');

class ExperienceService {
  async getAllExperience() {
    const list = await Experience.findAll();
    // Sort latest first
    return list.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));
  }

  async getExperienceById(id) {
    const item = await Experience.findById(id);
    if (!item) {
      throw { status: 404, message: `Experience with ID '${id}' was not found.` };
    }
    return item;
  }

  async createExperience(data) {
    const newExp = {
      company: data.company,
      position: data.position,
      startDate: data.startDate,
      endDate: data.endDate || 'Present',
      description: data.description || '',
      responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities ? [data.responsibilities] : []),
      achievements: Array.isArray(data.achievements) ? data.achievements : (data.achievements ? [data.achievements] : []),
      technologies: Array.isArray(data.technologies) ? data.technologies : (data.technologies ? data.technologies.split(',').map(t => t.trim()) : [])
    };
    return await Experience.create(newExp);
  }

  async updateExperience(id, data) {
    await this.getExperienceById(id);
    if (data.technologies && typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(t => t.trim());
    }
    return await Experience.update(id, data);
  }

  async deleteExperience(id) {
    await this.getExperienceById(id);
    return await Experience.delete(id);
  }
}

module.exports = new ExperienceService();
