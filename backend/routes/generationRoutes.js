const express = require('express');
const router = express.Router();
const generationController = require('../controllers/generationController');

router.post('/generate', generationController.generate);
router.get('/versions', generationController.getVersions);
router.get('/versions/:version', generationController.getVersion);
router.post('/rollback', generationController.rollback);

module.exports = router;
