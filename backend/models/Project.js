const { db } = require('./database');

class ProjectModel {
  static async findAll(filterFn = null) {
    return await db.get('projects', filterFn);
  }

  static async findById(id) {
    return await db.getById('projects', id);
  }

  static async create(data) {
    return await db.create('projects', data);
  }

  static async update(id, data) {
    return await db.update('projects', id, data);
  }

  static async delete(id) {
    return await db.delete('projects', id);
  }
}

module.exports = ProjectModel;
