const { db } = require('./database');

class CertificationModel {
  static async findAll(filterFn = null) {
    return await db.get('certifications', filterFn);
  }

  static async findById(id) {
    return await db.getById('certifications', id);
  }

  static async create(data) {
    return await db.create('certifications', data);
  }

  static async update(id, data) {
    return await db.update('certifications', id, data);
  }

  static async delete(id) {
    return await db.delete('certifications', id);
  }
}

module.exports = CertificationModel;
