const { db } = require('./database');

class EducationModel {
  static async findAll(filterFn = null) {
    return await db.get('education', filterFn);
  }

  static async findById(id) {
    return await db.getById('education', id);
  }

  static async create(data) {
    return await db.create('education', data);
  }

  static async update(id, data) {
    return await db.update('education', id, data);
  }

  static async delete(id) {
    return await db.delete('education', id);
  }
}

module.exports = EducationModel;
