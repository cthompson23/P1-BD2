const redisClient = require("../config/redis.js");

const cache = (keyFn, ttl = 60) => {
  return async (req, res, next) => {
    try {
      const key = keyFn(req);

      const data = await redisClient.get(key);

      if (data) {
        console.log(`Cache hit for key: ${key}`);
        return res.json(JSON.parse(data));
      }

      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        await redisClient.setEx(key, ttl, JSON.stringify(body));
        return originalJson(body);
      };

      next();
    } catch (err) {
      next(); 
    }
  };
};

module.exports = cache;