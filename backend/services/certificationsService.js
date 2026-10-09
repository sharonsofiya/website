const { Certification } = require('../models');

class CertificationsService {
  async getAllCertifications() {
    const list = await Certification.findAll();
    return list.sort((a, b) => (b.issueDate || '').localeCompare(a.issueDate || ''));
  }

  async getCertificationById(id) {
    const item = await Certification.findById(id);
    if (!item) {
      throw { status: 404, message: `Certification with ID '${id}' was not found.` };
    }
    return item;
  }

  async createCertification(data) {
    const newCert = {
      name: data.name,
      issuer: data.issuer,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate || 'Permanent',
      credentialId: data.credentialId || '',
      credentialUrl: data.credentialUrl || '',
      badgeIcon: data.badgeIcon || 'bi-patch-check-fill'
    };
    return await Certification.create(newCert);
  }

  async updateCertification(id, data) {
    await this.getCertificationById(id);
    return await Certification.update(id, data);
  }

  async deleteCertification(id) {
    await this.getCertificationById(id);
    return await Certification.delete(id);
  }
}

module.exports = new CertificationsService();
