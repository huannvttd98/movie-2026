const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authenticate } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

// Public routes
router.get('/', cacheMiddleware(300), movieController.getAllMovies);
router.get('/featured', cacheMiddleware(600), movieController.getFeaturedMovies);
router.get('/trending', cacheMiddleware(300), movieController.getTrendingMovies);
router.get('/search', movieController.searchMovies);
router.get('/:id', cacheMiddleware(600), movieController.getMovieById);

// Protected routes
router.post('/', authenticate, movieController.createMovie);
router.put('/:id', authenticate, movieController.updateMovie);
router.delete('/:id', authenticate, movieController.deleteMovie);
router.post('/:id/like', authenticate, movieController.likeMovie);
router.post('/:id/view', movieController.incrementView);

module.exports = router;
