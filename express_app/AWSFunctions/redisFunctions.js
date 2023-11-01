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

    await redis.set(name, {
      location: location,
      time: curTime,
      File: fileType,
    });

  } catch (error) {
    throw error;
  }
}

// Sample function to set and get a key-value pair
async function getAllKeys () {
  // Retrieve and log the value of key "foo"
  const value = await redis.keys('*');
  console.log(`All keys: ${value}`);
  return value
};

makeNew(test, test, test);

module.exports = {getAllKeys, makeNew};