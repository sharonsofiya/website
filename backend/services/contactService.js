const { ContactMessage } = require('../models');

class ContactService {
  async sendMessage({ name, email, subject, message }) {
    const newMessage = {
      name,
      email,
      subject,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    const saved = await ContactMessage.create(newMessage);
    return {
      success: true,
      message: 'Message sent successfully',
      data: {
        id: saved.id,
        createdAt: saved.createdAt
      }
    };
  }

  async getAllMessages() {
    const list = await ContactMessage.findAll();
    return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  async getMessageById(id) {
    const item = await ContactMessage.findById(id);
    if (!item) {
      throw { status: 404, message: `Message with ID '${id}' was not found.` };
    }
    return item;
  }

  async markAsRead(id) {
    await this.getMessageById(id);
    return await ContactMessage.update(id, { read: true });
  }

  async deleteMessage(id) {
    await this.getMessageById(id);
    return await ContactMessage.delete(id);
  }
}

module.exports = new ContactService();
