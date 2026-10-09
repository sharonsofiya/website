const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_TYPE: process.env.DB_TYPE || 'file', // 'file' (JSON storage) | 'memory' | 'sqlite' | 'mongo'
  DB_FILE_PATH: process.env.DB_FILE_PATH || path.resolve(__dirname, '../data/db.json'),
  JWT_SECRET: process.env.JWT_SECRET || 'portfolio-secure-jwt-secret-key-change-in-prod-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  ADMIN_KEY: process.env.ADMIN_KEY || 'agy-portfolio-admin-supersecret-token',
  GITHUB_USERNAME: process.env.GITHUB_USERNAME || 'alexvance-dev',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};

module.exports = config;
