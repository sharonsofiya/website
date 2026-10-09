const { SocialLink } = require('../models');

class SocialLinksService {
  async getAllSocialLinks() {
    return await SocialLink.findAll();
  }

  async getById(id) {
    const item = await SocialLink.findById(id);
    if (!item) {
      throw { status: 404, message: `Social link with ID '${id}' was not found.` };
    }
    return item;
  }

  async createSocialLink(data) {
    const newLink = {
      platform: data.platform,
      url: data.url,
      icon: data.icon || 'bi-link-45deg',
      displayName: data.displayName || data.platform
    };
    return await SocialLink.create(newLink);
  }

  async updateSocialLink(id, data) {
    await this.getById(id);
    return await SocialLink.update(id, data);
  }

  async deleteSocialLink(id) {
    await this.getById(id);
    return await SocialLink.delete(id);
  }
}

module.exports = new SocialLinksService();
