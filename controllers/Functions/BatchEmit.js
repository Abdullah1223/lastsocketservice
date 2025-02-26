const { RedisManager } = require('../../RedisConnection/RedisConnection');
const  { getIo }  = require('../../Socketio');
//const { RedisManager } = require('./RedisConnection/RedisConnection');
// Assuming you have a socket server instance
// Function to emit a message to a user, processing them in batches
const emitMessageToUser = async (userId, message, batchSize = 100,emitVariable) => {
 
  const io = getIo()
  const userKey = `onlineUsers${userId}`; // Redis key for online users of a particular user
  let cursor = 0; // Start at the beginning of the sorted set

  // Infinite loop to process batches
  while (true) {
    // Fetch a batch of socket IDs (start from the cursor)
    const sockets = await RedisManager.zrange(userKey, cursor, cursor + batchSize - 1);

    // If no sockets are fetched, exit the loop (all sockets have been processed)
    if (sockets.length === 0) break;

    // Emit the message to each socket in the batch
    sockets.forEach((socketId) => {
       // console.log(socketId)
      io.to(socketId).emit(`${emitVariable}`, message);
    });

    // Move the cursor forward by batch size to fetch the next set of socket IDs
    cursor += batchSize;
  }
};

// Usage example (this would be called to send a message to a user with userId '123456')
module.exports =emitMessageToUser;

