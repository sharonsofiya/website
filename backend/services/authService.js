const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { db } = require('../models');

class AuthService {
  async login(username, password) {
    if (!username || !password) {
      throw { status: 400, message: 'Username and password are required.' };
    }

    const validUsername = config.ADMIN_USERNAME;
    const validPassword = config.ADMIN_PASSWORD;

    if (username !== validUsername || password !== validPassword) {
      throw { status: 401, message: 'Invalid admin credentials.' };
    }

    const payload = {
      username,
      role: 'admin',
      iss: 'portfolio-auth-service'
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });

    return {
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        username,
        role: 'admin'
      }
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      return { valid: true, user: decoded };
    } catch (err) {
      return { valid: false, message: err.message };
    }
  }

  async resetData() {
    await db.resetToDefaults();
    return { success: true, message: 'Database reset to default seed records successfully' };
  }
}

module.exports = new AuthService();
