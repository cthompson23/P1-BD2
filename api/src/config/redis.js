const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

(async () => {
  await client.connect();
})();

module.exports = client;