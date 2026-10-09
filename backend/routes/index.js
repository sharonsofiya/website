const express = require('express');
const router = express.Router();

const profileRoutes = require('./profileRoutes');
const aboutRoutes = require('./aboutRoutes');
const skillsRoutes = require('./skillsRoutes');
const experienceRoutes = require('./experienceRoutes');
const projectsRoutes = require('./projectsRoutes');
const educationRoutes = require('./educationRoutes');
const certificationsRoutes = require('./certificationsRoutes');
const achievementsRoutes = require('./achievementsRoutes');
const socialRoutes = require('./socialRoutes');
const contactRoutes = require('./contactRoutes');
const githubRoutes = require('./githubRoutes');
const authRoutes = require('./authRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Routes
router.use('/profile', profileRoutes);
router.use('/about', aboutRoutes);
router.use('/skills', skillsRoutes);
router.use('/experience', experienceRoutes);
router.use('/projects', projectsRoutes);
router.use('/education', educationRoutes);
router.use('/certifications', certificationsRoutes);
router.use('/achievements', achievementsRoutes);
router.use('/social-links', socialRoutes);
router.use('/contact', contactRoutes);
router.use('/github', githubRoutes);
router.use('/auth', authRoutes);

module.exports = router;
