const Movie = require('../models/Movie');
const { getRedisClient } = require('../config/redis');

// Get all movies with pagination
exports.getAllMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-__v');

    const total = await Movie.countDocuments({ status: 'active' });

    res.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get featured movies
exports.getFeaturedMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ featured: true, status: 'active' })
      .sort({ rating: -1 })
      .limit(10)
      .select('-__v');

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// Get trending movies
exports.getTrendingMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ trending: true, status: 'active' })
      .sort({ viewCount: -1 })
      .limit(10)
      .select('-__v');

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// Search movies
exports.searchMovies = async (req, res, next) => {
  try {
    const { q, genre, year } = req.query;
    const query = { status: 'active' };
    let sortOptions = { createdAt: -1 }; // Default sort

    if (q) {
      query.$text = { $search: q };
      sortOptions = { score: { $meta: 'textScore' } };
    }
    if (genre) {
      query.genres = genre;
    }
    if (year) {
      query.releaseYear = parseInt(year);
    }

    const movies = await Movie.find(query)
      .sort(sortOptions)
      .limit(50)
      .select('-__v');

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// Get movie by ID
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).select('-__v');

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// Create new movie
exports.createMovie = async (req, res, next) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// Update movie
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    // Invalidate cache
    const redisClient = getRedisClient();
    if (redisClient) {
      await redisClient.del(`movie:${req.params.id}`);
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// Delete movie
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Like movie
exports.likeMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: { likes: movie.likes }
    });
  } catch (error) {
    next(error);
  }
};

// Increment view count
exports.incrementView = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: { viewCount: movie.viewCount }
    });
  } catch (error) {
    next(error);
  }
};
