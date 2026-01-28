const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  releaseYear: {
    type: Number,
    required: true,
    index: true
  },
  genres: [{
    type: String,
    index: true
  }],
  director: {
    type: String,
    trim: true
  },
  cast: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  thumbnail: {
    type: String
  },
  poster: {
    type: String
  },
  trailer: {
    type: String
  },
  // Video streaming data
  videoSources: [{
    quality: {
      type: String,
      enum: ['360p', '480p', '720p', '1080p', '4K']
    },
    url: {
      type: String,
      required: true
    },
    format: {
      type: String,
      enum: ['HLS', 'DASH', 'MP4'],
      default: 'HLS'
    },
    bitrate: {
      type: Number // in kbps
    }
  }],
  subtitles: [{
    language: String,
    url: String
  }],
  // Analytics
  viewCount: {
    type: Number,
    default: 0,
    index: true
  },
  currentViewers: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  // Metadata
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  trending: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'processing'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true
});

// Indexes for performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ createdAt: -1 });
movieSchema.index({ viewCount: -1 });
movieSchema.index({ rating: -1 });

module.exports = mongoose.model('Movie', movieSchema);
