const { db } = require('./database');

class ExperienceModel {
  static async findAll(filterFn = null) {
    return await db.get('experience', filterFn);
  }

  static async findById(id) {
    return await db.getById('experience', id);
  }

  static async create(data) {
    return await db.create('experience', data);
  }

  static async update(id, data) {
    return await db.update('experience', id, data);
  }

  static async delete(id) {
    return await db.delete('experience', id);
  }
}

module.exports = ExperienceModel;
