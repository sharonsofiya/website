const { Profile } = require('../models');

class ProfileService {
  async getProfile() {
    const profile = await Profile.get();
    if (!profile) {
      throw { status: 404, message: 'Profile data not found' };
    }
    return profile;
  }

  async updateProfile(updates) {
    return await Profile.update(updates);
  }
}

module.exports = new ProfileService();
