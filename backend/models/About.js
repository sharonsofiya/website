const { db } = require('./database');

class AboutModel {
  static async get() {
    return await db.getSingleton('about');
  }

  static async update(data) {
    return await db.setSingleton('about', data);
  }
}

module.exports = AboutModel;
