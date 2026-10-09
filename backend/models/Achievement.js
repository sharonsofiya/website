const { db } = require('./database');

class AchievementModel {
  static async findAll(filterFn = null) {
    return await db.get('achievements', filterFn);
  }

  static async findById(id) {
    return await db.getById('achievements', id);
  }

  static async create(data) {
    return await db.create('achievements', data);
  }

  static async update(id, data) {
    return await db.update('achievements', id, data);
  }

  static async delete(id) {
    return await db.delete('achievements', id);
  }
}

module.exports = AchievementModel;
