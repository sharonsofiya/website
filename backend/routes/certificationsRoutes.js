const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/certificationsController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', certificationsController.getAllCertifications.bind(certificationsController));
router.get('/:id', certificationsController.getCertificationById.bind(certificationsController));
router.post('/', protectAdmin, certificationsController.createCertification.bind(certificationsController));
router.put('/:id', protectAdmin, certificationsController.updateCertification.bind(certificationsController));
router.delete('/:id', protectAdmin, certificationsController.deleteCertification.bind(certificationsController));

module.exports = router;
