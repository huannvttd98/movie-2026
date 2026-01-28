const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');
const { authenticate } = require('../middleware/auth');

// Streaming routes
router.get('/:movieId/manifest', authenticate, streamController.getStreamManifest);
router.get('/:movieId/quality/:quality', authenticate, streamController.getStreamByQuality);
router.get('/:movieId/subtitle/:language', streamController.getSubtitle);

// Analytics
router.post('/:movieId/analytics', authenticate, streamController.trackStreamAnalytics);
router.get('/:movieId/viewers', streamController.getCurrentViewers);

module.exports = router;
