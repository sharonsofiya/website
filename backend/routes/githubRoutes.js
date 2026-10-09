const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.get('/', githubController.getGitHubData.bind(githubController));

module.exports = router;
