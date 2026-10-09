const { db } = require('./database');

class ProfileModel {
  static async get() {
    return await db.getSingleton('profile');
  }

  static async update(data) {
    return await db.setSingleton('profile', data);
  }
}

module.exports = ProfileModel;
