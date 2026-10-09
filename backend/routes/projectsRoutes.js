const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const { protectAdmin } = require('../middleware/auth');
const { validateProject } = require('../middleware/validator');

router.get('/', projectsController.getProjects.bind(projectsController));
router.get('/:id', projectsController.getProjectById.bind(projectsController));
router.post('/', protectAdmin, validateProject, projectsController.createProject.bind(projectsController));
router.put('/:id', protectAdmin, validateProject, projectsController.updateProject.bind(projectsController));
router.delete('/:id', protectAdmin, projectsController.deleteProject.bind(projectsController));

module.exports = router;
