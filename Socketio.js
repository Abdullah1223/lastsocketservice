const jwt = require('jsonwebtoken');
const socket = require('socket.io');
const {RedisManager} = require('./RedisConnection/RedisConnection');
const cookie = require('cookie');
const MessageDelivered = require('./controllers/MessageDelivered');
const unMountHandle = require('./controllers/unMountHandle');
const dotenv = require('dotenv')
dotenv.config()
let io; // Declare `io` at the module level for export

const InitializeSockets = async (server) => {
  // const ioCorsOptions = {
  //   origin: 'http://localhost:5173', // Allow your frontend domain
  //   allowedHeaders: ['Content-Type'],
  //   credentials: true,
  // };
  const ioCorsOptions = {
    origin: `${process.env.ORIGINURL}`, // Allow your frontend domain
    allowedHeaders: ['Content-Type'],
    credentials: true,
  };
  // Initialize Socket.IO
  io = socket(server, {
    cors: ioCorsOptions, // Enable CORS for Socket.IO
  });

const OnlineStatus = require('./controllers/OnlineStatus');
const SeenMessage = require('./controllers/SeenMessage');

  // Middleware for authentication
  io.use((socket, next) => {
    const cookieString = socket.handshake.headers.cookie;
    if (cookieString) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      const token = cookies.token;

      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return next(new Error('Authentication Token Invalid'));
        }

        socket.user = decoded.payload;
        next();
      });
    } else {
      return next(new Error('No Authentication Token'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
   // console.log('A user connected:', socket.id);
      
    if (socket.user) {
      const now = Date.now()
      const pipeline = RedisManager.pipeline();
    pipeline.zadd(`onlineUsers${socket.user._id}`, now, socket.id); // Add socket to sorted set
    pipeline.exec((err, results) => {
      if (err) {
        //console.error('Redis pipeline error during disconnection:', err);
      } else {
        //console.log('Redis pipeline executed successfully:', results);
      }
    });
     MessageDelivered(socket.user._id)
     SeenMessage(socket,io)
     OnlineStatus(socket,io)
     unMountHandle(socket)
      // const pipeline = RedisManager.pipeline();
      // pipeline.hset('onlineUsers', socket.user._id, socket.id);
      // pipeline.exec((err, results) => {
      //   if (err) {
      //     console.error('Error while adding user to Redis:', err);
      //   } else {
      //     console.log('User added to Redis:', results);
      //   }
      // });
    }

    socket.on('message', (data) => {
      //console.log('Message from client:', data);
      io.emit('message', data);
    });
    socket.on('disconnect', () => {
    //  console.log('User disconnected:', socket.id);

      if (socket.user) {
        const pipeline = RedisManager.pipeline()
         pipeline.zrem(`onlineUsers${socket.user._id}`, socket.id);
         pipeline.exec((err, results) => {
          if (err) {
            //console.error('Redis pipeline error during disconnection:', err);
          } else {
           // console.log('Redis pipeline executed successfully:', results);
          }
        });
         RedisManager.hdel('ActiveChats',`${socket.user._id}`)
        // const pipeline = RedisManager.pipeline();
        // pipeline.hdel('onlineUsers', socket.user._id);
        // pipeline.exec((err, results) => {
        //   if (err) {
        //     console.error('Error while removing user from Redis:', err);
        //   } else {
        //     console.log('User removed from Redis:', results);
        //   }
        // });
      }
    });
  });
};

// Export both the InitializeSockets function and the `io` instance
module.exports = { InitializeSockets, getIo: () => io, };
