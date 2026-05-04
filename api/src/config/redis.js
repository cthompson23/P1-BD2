const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

client.on("error", (err) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("Redis error:", err);
  }
});

async function connectRedis() {
  if (process.env.NODE_ENV !== "test") {
    await client.connect();
  }
}

// solo conectar si NO es test
connectRedis();

module.exports = client;