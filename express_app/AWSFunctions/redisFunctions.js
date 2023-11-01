const Redis = require('ioredis');

const redisEndpoint = 'group87-redis-cluster.km2jzi.ng.0001.apse2.cache.amazonaws.com';
const redisPort = 6379;

// Initialize new Redis client
const redis = new Redis({
  host: redisEndpoint,
  port: redisPort,
});

// On error, create console error
redis.on('error', (error) => {
  console.error('Redis error', error);
});

// Function to create new key value pair in Elasticache 
async function makeNewKeyPair (name, location, fileType) {
  try {
    const curTime = Date.now();
    
    await redis.set(name, `{ location: ${location}, time: ${curTime}, File: ${fileType} }`);

  } catch (error) {
    throw error;
  }
}

// Function to retrieve all keys and their values from Elasticache
async function getCacheData () {

  const allKeys = await redis.keys('*');
  
  const keyValueData = {};

  // Iterate through the keys and fetch their values
  for (const key of allKeys) {
    const value = await redis.get(key);
    keyValueData[key] = value;
  }

  return keyValueData
};

module.exports = {getCacheData, makeNewKeyPair};

