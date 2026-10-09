const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/env');
const apiRoutes = require('./routes');
const swaggerDocs = require('./swagger/swaggerDocs');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security Headers with tailored Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://avatars.githubusercontent.com", "https://github.com", "https://*.githubusercontent.com"],
        connectSrc: ["'self'", "https://api.github.com", `http://localhost:${config.PORT}`]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));

// Request Body Parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Request Logger
if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger / OpenAPI UI Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customSiteTitle: 'Sharon Sofiya | Portfolio REST API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #0d6efd; font-family: system-ui, -apple-system, sans-serif; }
    `
  })
);

// Raw OpenAPI JSON spec endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// General API rate limiter applied to all /api routes
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', apiRoutes);

// Static frontend serving
const frontendDir = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendDir));

// Fallback route for frontend SPA navigation
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'pages', 'index.html'));
});

// 404 Handler for undefined API routes
app.use('/api', notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server if executed directly
if (require.main === module) {
  const server = app.listen(config.PORT, () => {
    console.log(`
===========================================================
🚀 Portfolio REST API Server Running!
📡 Environment:  ${config.NODE_ENV}
🌐 Local URL:    http://localhost:${config.PORT}
📚 Swagger UI:   http://localhost:${config.PORT}/api-docs
📄 OpenAPI Spec: http://localhost:${config.PORT}/api-docs.json
💼 Frontend:     http://localhost:${config.PORT}
===========================================================
    `);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Error] Port ${config.PORT} is already in use. Please check running processes.`);
    } else {
      console.error('[Server Error]:', err);
    }
  });
}

module.exports = app;
