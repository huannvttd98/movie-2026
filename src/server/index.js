require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const connectRedis = require('./config/redis');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const streamRoutes = require('./routes/stream');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Connect to databases
connectDB();
connectRedis();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Request logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const streamLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Allow more requests for streaming
  message: 'Stream rate limit exceeded'
});

app.use('/api/', apiLimiter);
app.use('/api/stream/', streamLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req, res) => {
  // Placeholder for Prometheus metrics
  res.status(200).send('# Metrics endpoint');
});

// API Routes
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stream', streamRoutes);

// WebSocket for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Track concurrent viewers
  socket.on('watching', (movieId) => {
    socket.join(`movie-${movieId}`);
    const viewers = io.sockets.adapter.rooms.get(`movie-${movieId}`)?.size || 0;
    io.to(`movie-${movieId}`).emit('viewer-count', viewers);
  });

  socket.on('stop-watching', (movieId) => {
    socket.leave(`movie-${movieId}`);
    const viewers = io.sockets.adapter.rooms.get(`movie-${movieId}`)?.size || 0;
    io.to(`movie-${movieId}`).emit('viewer-count', viewers);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎬 Movie streaming platform ready for 1000-10000 concurrent users`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
