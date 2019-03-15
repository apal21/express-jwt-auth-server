import redis from 'redis';

const client = redis.createClient();
client.on('error', err => {
  // eslint-disable-next-line no-console
  console.error(err);
});

client.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('Redis connected');
});

export default client;
