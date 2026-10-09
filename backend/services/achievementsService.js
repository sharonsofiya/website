const { Achievement } = require('../models');

class AchievementsService {
  async getAllAchievements() {
    const list = await Achievement.findAll();
    return list.sort((a, b) => (b.year || '').localeCompare(a.year || ''));
  }

  async getAchievementById(id) {
    const item = await Achievement.findById(id);
    if (!item) {
      throw { status: 404, message: `Achievement with ID '${id}' was not found.` };
    }
    return item;
  }

  async createAchievement(data) {
    const newAch = {
      title: data.title,
      category: data.category || 'Award',
      year: data.year || new Date().getFullYear().toString(),
      description: data.description || '',
      icon: data.icon || 'bi-trophy-fill',
      link: data.link || '#'
    };
    return await Achievement.create(newAch);
  }

  async updateAchievement(id, data) {
    await this.getAchievementById(id);
    return await Achievement.update(id, data);
  }

  async deleteAchievement(id) {
    await this.getAchievementById(id);
    return await Achievement.delete(id);
  }
}

module.exports = new AchievementsService();
