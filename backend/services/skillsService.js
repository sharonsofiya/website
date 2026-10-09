const { Skill } = require('../models');

class SkillsService {
  async getAllSkills(category = null) {
    if (category && category !== 'All') {
      return await Skill.findAll(s => s.category.toLowerCase() === category.toLowerCase());
    }
    return await Skill.findAll();
  }

  async getSkillById(id) {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw { status: 404, message: `Skill with ID '${id}' was not found.` };
    }
    return skill;
  }

  async createSkill(data) {
    const newSkill = {
      name: data.name,
      category: data.category || 'General',
      icon: data.icon || 'bi-gear-fill',
      proficiency: Number(data.proficiency) || 80
    };
    return await Skill.create(newSkill);
  }

  async updateSkill(id, data) {
    await this.getSkillById(id); // Ensure exists
    return await Skill.update(id, data);
  }

  async deleteSkill(id) {
    await this.getSkillById(id); // Ensure exists
    return await Skill.delete(id);
  }
}

module.exports = new SkillsService();
