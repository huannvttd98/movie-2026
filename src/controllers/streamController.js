const Movie = require('../models/Movie');
const { getRedisClient } = require('../config/redis');

// Get stream manifest (HLS/DASH)
exports.getStreamManifest = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    // Check user subscription level for quality restrictions
    const userQuality = req.user.subscription.plan;
    let availableQualities = movie.videoSources;

    if (userQuality === 'free') {
      // Free users limited to 480p
      availableQualities = availableQualities.filter(
        source => ['360p', '480p'].includes(source.quality)
      );
    } else if (userQuality === 'basic') {
      // Basic users limited to 720p
      availableQualities = availableQualities.filter(
        source => !source.quality.includes('4K')
      );
    }

    // Increment current viewers
    await Movie.findByIdAndUpdate(
      req.params.movieId,
      { $inc: { currentViewers: 1 } }
    );

    res.json({
      success: true,
      data: {
        movieId: movie._id,
        title: movie.title,
        sources: availableQualities,
        subtitles: movie.subtitles
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get stream by quality
exports.getStreamByQuality = async (req, res, next) => {
  try {
    const { movieId, quality } = req.params;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    const source = movie.videoSources.find(s => s.quality === quality);

    if (!source) {
      return res.status(404).json({
        success: false,
        error: 'Quality not available'
      });
    }

    res.json({
      success: true,
      data: source
    });
  } catch (error) {
    next(error);
  }
};

// Get subtitle
exports.getSubtitle = async (req, res, next) => {
  try {
    const { movieId, language } = req.params;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    const subtitle = movie.subtitles.find(s => s.language === language);

    if (!subtitle) {
      return res.status(404).json({
        success: false,
        error: 'Subtitle not available'
      });
    }

    res.json({
      success: true,
      data: subtitle
    });
  } catch (error) {
    next(error);
  }
};

// Track stream analytics
exports.trackStreamAnalytics = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { action, timestamp, quality, buffering } = req.body;

    // Store analytics in Redis for real-time processing
    const redisClient = getRedisClient();
    if (redisClient) {
      const analyticsKey = `analytics:${movieId}:${Date.now()}`;
      await redisClient.setEx(
        analyticsKey,
        3600, // 1 hour TTL
        JSON.stringify({
          userId: req.user.id,
          action,
          timestamp,
          quality,
          buffering
        })
      );
    }

    res.json({
      success: true,
      message: 'Analytics tracked'
    });
  } catch (error) {
    next(error);
  }
};

// Get current viewers count
exports.getCurrentViewers = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
      .select('currentViewers');

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: {
        viewers: movie.currentViewers
      }
    });
  } catch (error) {
    next(error);
  }
};
