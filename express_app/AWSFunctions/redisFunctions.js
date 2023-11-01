// Importing required libraries and modules
const Redis = require('ioredis');

// Your ElastiCache Redis endpoint URL and port
const redisEndpoint = 'group87-redis-cluster.km2jzi.ng.0001.apse2.cache.amazonaws.com';
const redisPort = 6379;

// Initialize Redis client
// Connection string generally has the format: 'redis://username:password@hostname:port'
const redis = new Redis({
  host: redisEndpoint,
  port: redisPort,
  // Additional options can be added here
});

// Listen for the "connect" event to confirm that the client has connected successfully
redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Listen for the "error" event to catch and display errors
redis.on('error', (error) => {
  console.error('Redis error', error);
});

async function makeNew (name, location, fileType) {
  try {
    const curTime = Date.now();

    await redis.set(name, `{ location: ${location}, time: ${curTime}, File: ${fileType} }`);

  } catch (error) {
    throw error;
  }
}

// Sample function to set and get a key-value pair
async function getCacheData () {
  const allKeys = await redis.keys('*');
  
  // Initialize an empty object to store key-value pairs
  const keyValueData = {};

  // Iterate through the keys and fetch their values
  for (const key of allKeys) {
    const value = await redis.get(key);
    keyValueData[key] = value;
  }

  return keyValueData
};

makeNew('test3', 'test3', 'test3')

module.exports = {getCacheData, makeNew};