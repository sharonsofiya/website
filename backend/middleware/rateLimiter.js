const rateLimit = require('express-rate-limit');

// Rate limiter for general API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests from this IP address, please try again after 15 minutes.'
  }
});

// Stricter rate limiter for contact form submissions to prevent spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Contact form submission limit reached. Please wait a few minutes before sending another message.'
  }
});

module.exports = {
  apiLimiter,
  contactLimiter
};
