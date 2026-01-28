const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'default-secret', {
    expiresIn: '7d'
  });
};

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      fullName
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchlist')
      .populate('favorites');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['fullName', 'avatar', 'emailNotifications', 'autoPlay', 'preferredQuality'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Add to watchlist
exports.addToWatchlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { watchlist: req.params.movieId } },
      { new: true }
    ).populate('watchlist');

    res.json({
      success: true,
      data: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

// Remove from watchlist
exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { watchlist: req.params.movieId } },
      { new: true }
    ).populate('watchlist');

    res.json({
      success: true,
      data: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

// Add to favorites
exports.addToFavorites = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: req.params.movieId } },
      { new: true }
    ).populate('favorites');

    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

// Remove from favorites
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: req.params.movieId } },
      { new: true }
    ).populate('favorites');

    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

// Get watch history
exports.getWatchHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchHistory.movie')
      .select('watchHistory');

    res.json({
      success: true,
      data: user.watchHistory
    });
  } catch (error) {
    next(error);
  }
};

// Update watch progress
exports.updateWatchProgress = async (req, res, next) => {
  try {
    const { progress, completed } = req.body;
    const user = await User.findById(req.user.id);

    const historyIndex = user.watchHistory.findIndex(
      item => item.movie.toString() === req.params.movieId
    );

    if (historyIndex > -1) {
      user.watchHistory[historyIndex].progress = progress;
      user.watchHistory[historyIndex].completed = completed;
      user.watchHistory[historyIndex].watchedAt = new Date();
    } else {
      user.watchHistory.push({
        movie: req.params.movieId,
        progress,
        completed
      });
    }

    await user.save();

    res.json({
      success: true,
      data: user.watchHistory
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    // Implementation placeholder
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};
