const { db } = require('./database');

class SocialLinkModel {
  static async findAll() {
    return await db.get('socialLinks');
  }

  static async findById(id) {
    return await db.getById('socialLinks', id);
  }

  static async create(data) {
    return await db.create('socialLinks', data);
  }

  static async update(id, data) {
    return await db.update('socialLinks', id, data);
  }

  static async delete(id) {
    return await db.delete('socialLinks', id);
  }
}

module.exports = SocialLinkModel;
