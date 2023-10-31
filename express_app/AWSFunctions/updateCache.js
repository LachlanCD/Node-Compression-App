const Redis = require('ioredis');

// Initialize the Redis cluster client
const cluster = new Redis.Cluster([
  {
    host: 'group87-redis-cluster.km2jzi.ng.0001.apse2.cache.amazonaws.com',
    port: 6379
  }
]);

// Connection established
cluster.on('connect', () => {
  console.log('Connected to Redis Cluster');
});

// Connection error
cluster.on('error', (err) => {
  console.error(`Error: ${err}`);
});

// On client closed
cluster.on('end', () => {
  console.error('Client closed');
});

// Test set and get
cluster.set('key', 'value', (err, reply) => {
  if (err) {
    return console.error(`Set Error: ${err}`);
  }
  console.log(`Set Reply: ${reply}`);

  cluster.get('key', (err, reply) => {
    if (err) {
      return console.error(`Get Error: ${err}`);
    }
    console.log(`Get Reply: ${reply}`);
  });
});
