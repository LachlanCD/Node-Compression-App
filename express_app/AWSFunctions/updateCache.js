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

// Adding event listeners to handle events

// Listen for the "connect" event to confirm that the client has connected successfully
redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Listen for the "error" event to catch and display errors
redis.on('error', (error) => {
  console.error('Redis error', error);
});

// Sample function to set and get a key-value pair
const testRedis = async () => {
  // Set key "foo" to hold the value "bar"
  await redis.set('foo', 'bar');
  
  // Retrieve and log the value of key "foo"
  const value = await redis.get('foo');
  console.log(`Value of key foo: ${value}`);
};

// Execute the sample function
testRedis().catch(console.error);