const Redis = require('ioredis');

const redisEndpoint = 'group87-redis-cluster.km2jzi.ng.0001.apse2.cache.amazonaws.com';
const redisPort = 6379;

// Initialize new Redis client
const redis = new Redis({
  host: redisEndpoint,
  port: redisPort,
  connectTimeout: 30000,
});

// Listen for and display Redis errors
redis.on('error', (error) => {
  console.error('Redis error', error);
});

// Function to create new key value pair in Elasticache 
async function makeNewKeyPairRedis (name, location, fileType) {
  try {
    checkRedisConnection();
    const curTime = Date.now();
    
    await redis.set(name, `{ "location": "${location}", "time": "${curTime}", "File": "${fileType}" }`);

  } catch (err) {
    throw err;
  }
}

// Function to retrieve all keys and their values from Elasticache
async function getDataRedis () {
  try {
    checkRedisConnection();

    const allKeys = await redis.keys('*');
    const keyValueData = {};

    // Iterate through the keys and fetch their values
    for (const key of allKeys) {
      const value = await redis.get(key);
      keyValueData[key] = value;
    }

    return keyValueData

  } catch (err) {
    throw err
  }
};

// Function to get value for given key
async function getKeyDataRedis(key) {
  try {
    checkRedisConnection();

    const keyValueData = await redis.get(key);
    return keyValueData

  } catch (err) {
    throw err
  }
}

// Function to delete a key from redis
async function deleteKeyRedis(key) {
  try {
    checkRedisConnection();
    const result = await redis.del(key);

    if (result !== 1) throw { status: 404, message: `Key ${key} not found` };

  } catch (err) {
    throw err
  }
}

// Function to test the redis connection
function checkRedisConnection() {
  if (redis.status !== 'ready') throw { status: 503, message: 'Redis connection failed' };
}

module.exports = {makeNewKeyPairRedis, getDataRedis, getKeyDataRedis, deleteKeyRedis};