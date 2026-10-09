const jwt = require('jsonwebtoken');
const config = require('../config/env');

function protectAdmin(req, res, next) {
  // 1. Check for API Key header
  const apiKey = req.headers['x-admin-key'];
  if (apiKey && apiKey === config.ADMIN_KEY) {
    req.admin = { role: 'admin', authType: 'api_key' };
    return next();
  }

  // 2. Check for Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.admin = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired authentication token.'
      });
    }
  }

  return res.status(401).json({
    success: false,
    error: 'Unauthorized',
    message: 'Access denied. Administrative authorization token or x-admin-key header required.'
  });
}

module.exports = {
  protectAdmin
};
