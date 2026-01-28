const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/watchlist/:movieId', authenticate, userController.addToWatchlist);
router.delete('/watchlist/:movieId', authenticate, userController.removeFromWatchlist);
router.post('/favorites/:movieId', authenticate, userController.addToFavorites);
router.delete('/favorites/:movieId', authenticate, userController.removeFromFavorites);
router.get('/watch-history', authenticate, userController.getWatchHistory);
router.post('/watch-history/:movieId', authenticate, userController.updateWatchProgress);

module.exports = router;
