//  const IORedis = require('ioredis')
 
//  const RedisManager = new IORedis({maxRetriesPerRequest: null },
//                  {
//                      retryStrategy(times) {
//                             const delay = Math.min(times * 50, 2000);
//                             return delay;
//                           },
//                  },
//         'rediss://default:AVNS_xvg1g5mw1124APDNcD7@caching-197552da-normalcsgo21-4cff.e.aivencloud.com:28221'
//         // {
//         //         port:15933,
//         //         host:'redis-15933.c334.asia-southeast2-1.gce.redns.redis-cloud.com',
//         //         username:'default', 
//         //         password:'Ke91uSFazEiqq4J0sXmVGhPg4PNYEtEt',
                
//         // }
//  )



 

// module.exports= {RedisManager};
const IORedis = require('ioredis');

const RedisManager = new IORedis({
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
  keepAlive: 10000, // Send a ping every 10 seconds
},        'rediss://default:AVNS_0WDCTxpoCRCt-oTO-e_@caching-8d0912f-testtust21-e578.h.aivencloud.com:11860'
);

// Handle errors and reconnections
RedisManager.on('error', (err) => {
  console.error('Redis error:', err);
});

RedisManager.on('end', () => {
 // console.log('Redis connection ended. Reconnecting...');
  RedisManager.connect().catch(err => console.error('Reconnection error:', err));
});

module.exports = {RedisManager};

