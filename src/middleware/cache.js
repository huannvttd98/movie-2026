const { getRedisClient } = require('../config/redis');

exports.cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    const redisClient = getRedisClient();
    
    if (!redisClient) {
      return next();
    }

    try {
      const key = `cache:${req.originalUrl}`;
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Store original send function
      const originalSend = res.json.bind(res);

      // Override send function to cache the response
      res.json = (body) => {
        redisClient.setEx(key, ttl, JSON.stringify(body))
          .catch(err => console.error('Cache set error:', err));
        return originalSend(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};
