// const IORedis = require('ioredis')
// const RedisPublisher = new IORedis(
//   {
//     retryStrategy(times) {
//            const delay = Math.min(times * 50, 2000);
//            return delay;
//          },
// },
//     'rediss://default:AVNS_xvg1g5mw1124APDNcD7@caching-197552da-normalcsgo21-4cff.e.aivencloud.com:28221'
// );

const IORedis = require('ioredis');

const RedisPublisher = new IORedis({
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
  keepAlive: 10000, // Send a ping every 10 seconds
},        'rediss://default:AVNS_0WDCTxpoCRCt-oTO-e_@caching-8d0912f-testtust21-e578.h.aivencloud.com:11860'
);

// Handle errors and reconnections
RedisPublisher.on('error', (err) => {
  console.error('Redis error:', err);
});

RedisPublisher.on('end', () => {
  //console.log('Redis connection ended. Reconnecting...');
  RedisPublisher.connect().catch(err => console.error('Reconnection error:', err));
});


// Singleton Redis subscriber

// const RedisSubscriber = new IORedis(
//   {
//     retryStrategy(times) {
//            const delay = Math.min(times * 50, 2000);
//            return delay;
//          },
// },
//   'rediss://default:AVNS_xvg1g5mw1124APDNcD7@caching-197552da-normalcsgo21-4cff.e.aivencloud.com:28221'
// );

const RedisSubscriber = new IORedis({
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
  keepAlive: 10000, // Send a ping every 10 seconds
},       'rediss://default:AVNS_0WDCTxpoCRCt-oTO-e_@caching-8d0912f-testtust21-e578.h.aivencloud.com:11860'
);

// Handle errors and reconnections
RedisSubscriber.on('error', (err) => {
  console.error('Redis error:', err);
});

RedisSubscriber.on('end', () => {
 // console.log('Redis connection ended. Reconnecting...');
  RedisSubscriber.connect().catch(err => console.error('Reconnection error:', err));
});


module.exports = {RedisPublisher,RedisSubscriber}