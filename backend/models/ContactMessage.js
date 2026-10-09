const { db } = require('./database');

class ContactMessageModel {
  static async findAll(filterFn = null) {
    return await db.get('contactMessages', filterFn);
  }

  static async findById(id) {
    return await db.getById('contactMessages', id);
  }

  static async create(data) {
    return await db.create('contactMessages', data);
  }

  static async update(id, data) {
    return await db.update('contactMessages', id, data);
  }

  static async delete(id) {
    return await db.delete('contactMessages', id);
  }
}

module.exports = ContactMessageModel;
