const { db } = require('./database');

class SkillModel {
  static async findAll(filterFn = null) {
    return await db.get('skills', filterFn);
  }

  static async findById(id) {
    return await db.getById('skills', id);
  }

  static async create(data) {
    return await db.create('skills', data);
  }

  static async update(id, data) {
    return await db.update('skills', id, data);
  }

  static async delete(id) {
    return await db.delete('skills', id);
  }
}

module.exports = SkillModel;
