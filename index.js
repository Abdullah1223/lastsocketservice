const sticky = require('sticky-session');  // Correct import
const express = require('express')
const cors = require('cors')
const {createServer} = require('http');
const socket = require('socket.io');

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
dotenv.config()
if (sticky.hasMaster) {
  // This is the master process
  for (let i = 0; i < os; i++) {
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

  // app.use(cors({
  //   origin: 'http://localhost:5173', 
  //   allowedHeaders: ['Content-Type'],
  //   credentials: true,
  // }));


  const server = createServer(app); 
  conn(process.env.MONGODBURI)
  app.use(morgan('dev'))
  app.use(express.json())
   app.use(cookieParser())
   
  InitializeSockets(server)
 
  app.use('/messagesend',JwtAuth2,routeformessagesend)
  app.use('/fetchingchats',JwtAuth2,routeforfetchingchats)
  app.use('/fetchingchatshistory',JwtAuth2,routeforfetchingchatshistory)
  app.use('/messagDeleteNEdit',JwtAuth2,routeformessagedeletenedit)
  app.use('/FirstMessageCreate',JwtAuth2,routeforfirstmessagecreate)
  connection()
  MessageConsumerConnected()
   ConnectingKafkaWorker()
   KafkaConsumer()
   SubscriberCreation()
   MessageRecive()
   MessageDelivered()
   FollowNotificationSubscriber()
   MessageDeliveredSubscribe()
   SubscriberCompetitionCreationNotification()
   MessageSeenSubscriber()
   MessageDeleteNEditSubscriber()
   ProfileModificationSubscriber()
  server.listen(8005, () => {
    console.log('Server started on port 8005');
  });
}
