const redis = require('redis');

let redisClient;

const connectRedis = async () => {
  try {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = redis.createClient({
      url: redisURL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis reconnection failed after 10 attempts');
            return false; // Stop reconnecting
          }
          return retries * 100; // Exponential backoff
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis Connected Successfully');
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });

    await redisClient.connect();

  } catch (error) {
    console.error('❌ Redis Connection Error:', error.message);
    // Don't exit process, allow app to run without Redis
  }
};

const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    console.warn('Redis client not available');
    return null;
  }
  return redisClient;
};

module.exports = connectRedis;
module.exports.getRedisClient = getRedisClient;
