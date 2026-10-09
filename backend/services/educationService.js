const { Education } = require('../models');

class EducationService {
  async getAllEducation() {
    const list = await Education.findAll();
    return list.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));
  }

  async getEducationById(id) {
    const item = await Education.findById(id);
    if (!item) {
      throw { status: 404, message: `Education entry with ID '${id}' was not found.` };
    }
    return item;
  }

  async createEducation(data) {
    const newEdu = {
      degree: data.degree,
      institution: data.institution,
      fieldOfStudy: data.fieldOfStudy || '',
      startDate: data.startDate,
      endDate: data.endDate || 'Present',
      grade: data.grade || '',
      description: data.description || '',
      activities: Array.isArray(data.activities) ? data.activities : (data.activities ? [data.activities] : [])
    };
    return await Education.create(newEdu);
  }

  async updateEducation(id, data) {
    await this.getEducationById(id);
    return await Education.update(id, data);
  }

  async deleteEducation(id) {
    await this.getEducationById(id);
    return await Education.delete(id);
  }
}

module.exports = new EducationService();
