const { About } = require('../models');

class AboutService {
  async getAbout() {
    const about = await About.get();
    if (!about) {
      throw { status: 404, message: 'About data not found' };
    }
    return about;
  }

  async updateAbout(updates) {
    return await About.update(updates);
  }
}

module.exports = new AboutService();
