// const sticky = require('sticky-session');  // Correct import
// const express = require('express')
// const cors = require('cors')
// const {createServer} = require('http');
// const socket = require('socket.io');

// const cookieParser = require('cookie-parser');
// const dotenv = require('dotenv');
// const morgan = require('morgan');
// const routeformessagesend = require('./routes/MessageSend');
// const { InitializeSockets } = require('./Socketio');
// const MessageRecive = require('./controllers/MessageRecive');
// const kafka = require('kafka');
// const { ConnectoToProducer, connection } = require('./KafkaConnection/KafkaConnection');
// const KafkaConsumer = require('./KafkaConnection/KafkaWorker');
// const ConnectingKafkaWorker = require('./KafkaConnection/ConnectingKafkaWorker');
// const conn = require('./Connection');
// const routeforfetchingchats = require('./routes/FetchingChats');
// const JwtAuth2 = require('./middlewares/JwtAuth2');
// const FetchingChatHistory = require('./controllers/FetchingChatsHistory');
// const routeforfetchingchatshistory = require('./routes/FetchingChatsHistory');
// const MessageConsumerConnected = require('./KafkaConnection/MessageConsumerConnect');
// const SubscriberCreation = require('./controllers/SubscriberCreation');
// const SubscriberCompetitionCreationNotification = require('./controllers/SubscriberCompetitionCreationNotification');
// const FollowNotificationSubscriber = require('./controllers/FollowNotificationSubcriber');
// const MessageDelivered = require('./controllers/MessageDelivered');
// const MessageDeliveredSubscribe = require('./controllers/MessageDeliveredSubscribe');
// const MessageSeenSubscriber = require('./controllers/MessageSeenSubscriber');
// const routeformessagedeletenedit = require('./routes/MessageDeleteNEdit');
// const MessageDeleteNEditSubscriber = require('./controllers/MessageDeleteNEditSubscriber');
// const ProfileModificationSubscriber = require('./controllers/ProfileModificationSubscriber');
// const routeforfirstmessagecreate = require('./routes/FirstMessageCreate');
// dotenv.config()
// if (sticky.hasMaster) {
//   // This is the master process
//   for (let i = 0; i < os; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {

//   const app = express();


//   app.use(cors({
//     origin: `${process.env.ORIGINURL}`, 
//     allowedHeaders: ['Content-Type'],
//     credentials: true,
//   }));

//   // app.use(cors({
//   //   origin: 'http://localhost:5173', 
//   //   allowedHeaders: ['Content-Type'],
//   //   credentials: true,
//   // }));


//   const server = createServer(app); 
//   conn(process.env.MONGODBURI)
//   app.use(morgan('dev'))
//   app.use(express.json())
//    app.use(cookieParser())
   
//   InitializeSockets(server)
 
//   app.use('/messagesend',JwtAuth2,routeformessagesend)
//   app.use('/fetchingchats',JwtAuth2,routeforfetchingchats)
//   app.use('/fetchingchatshistory',JwtAuth2,routeforfetchingchatshistory)
//   app.use('/messagDeleteNEdit',JwtAuth2,routeformessagedeletenedit)
//   app.use('/FirstMessageCreate',JwtAuth2,routeforfirstmessagecreate)
//   connection()
//   MessageConsumerConnected()
//    ConnectingKafkaWorker()
//    KafkaConsumer()
//    SubscriberCreation()
//    MessageRecive()
//    MessageDelivered()
//    FollowNotificationSubscriber()
//    MessageDeliveredSubscribe()
//    SubscriberCompetitionCreationNotification()
//    MessageSeenSubscriber()
//    MessageDeleteNEditSubscriber()
//    ProfileModificationSubscriber()
//   server.listen(8005, () => {
//     console.log('Server started on port 8005');
//   });
// }




const sticky = require('sticky-session');
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const socket = require('socket.io');
const fs = require('fs');
const https = require('https');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const routeformessagesend = require('./routes/MessageSend');
const { InitializeSockets } = require('./Socketio');
const MessageRecive = require('./controllers/MessageRecive');
const kafka = require('kafka');
const { ConnectoToProducer, connection } = require('./KafkaConnection/KafkaConnection');
const KafkaConsumer = require('./KafkaConnection/KafkaWorker');
const ConnectingKafkaWorker = require('./KafkaConnection/ConnectingKafkaWorker');
const conn = require('./Connection');
const routeforfetchingchats = require('./routes/FetchingChats');
const JwtAuth2 = require('./middlewares/JwtAuth2');
const FetchingChatHistory = require('./controllers/FetchingChatsHistory');
const routeforfetchingchatshistory = require('./routes/FetchingChatsHistory');
const MessageConsumerConnected = require('./KafkaConnection/MessageConsumerConnect');
const SubscriberCreation = require('./controllers/SubscriberCreation');
const SubscriberCompetitionCreationNotification = require('./controllers/SubscriberCompetitionCreationNotification');
const FollowNotificationSubscriber = require('./controllers/FollowNotificationSubcriber');
const MessageDelivered = require('./controllers/MessageDelivered');
const MessageDeliveredSubscribe = require('./controllers/MessageDeliveredSubscribe');
const MessageSeenSubscriber = require('./controllers/MessageSeenSubscriber');
const routeformessagedeletenedit = require('./routes/MessageDeleteNEdit');
const MessageDeleteNEditSubscriber = require('./controllers/MessageDeleteNEditSubscriber');
const ProfileModificationSubscriber = require('./controllers/ProfileModificationSubscriber');
const routeforfirstmessagecreate = require('./routes/FirstMessageCreate');

dotenv.config();
const PORT = process.env.PORT || 8005;

if (sticky.hasMaster) {
  for (let i = 0; i < require('os').availableParallelism(); i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  
  app.use(cors({
    origin: `${process.env.ORIGINURL}`,
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }));
  
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());
  
  conn(process.env.MONGODBURI);
  InitializeSockets(app);
  
  app.use('/messagesend', JwtAuth2, routeformessagesend);
  app.use('/fetchingchats', JwtAuth2, routeforfetchingchats);
  app.use('/fetchingchatshistory', JwtAuth2, routeforfetchingchatshistory);
  app.use('/messagDeleteNEdit', JwtAuth2, routeformessagedeletenedit);
  app.use('/FirstMessageCreate', JwtAuth2, routeforfirstmessagecreate);
  
  connection();
  MessageConsumerConnected();
  ConnectingKafkaWorker();
  KafkaConsumer();
  SubscriberCreation();
  MessageRecive();
  MessageDelivered();
  FollowNotificationSubscriber();
  MessageDeliveredSubscribe();
  SubscriberCompetitionCreationNotification();
  MessageSeenSubscriber();
  MessageDeleteNEditSubscriber();
  ProfileModificationSubscriber();
  
    const privateKey = fs.readFileSync('/etc/ssl/mycert/private-key.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/ssl/mycert/certificate.pem', 'utf8');
 // const ca = fs.readFileSync('/path/to/ca.pem', 'utf8'); // For some certificates, this might be required.
  const passphrase = '123456';
  const credentials = { key: privateKey, cert: certificate,passphrase: passphrase };
  
  https.createServer(credentials, app).listen(PORT, () => {
    console.log(`HTTPS server is running on port ${PORT}`);
  });
}

// const http = require('http');
// http.createServer((req, res) => {
//   res.writeHead(301, { Location: `https://${req.headers.host}:${PORT}${req.url}` });
//   res.end();
// }).listen(80, () => {
//   console.log('HTTP server is redirecting to HTTPS on port 80');
// });
