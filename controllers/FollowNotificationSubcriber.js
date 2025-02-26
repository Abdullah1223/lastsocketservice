const { RedisSubscriber } = require("../RedisConnection/ForPubSub");
const {getIo}= require('../Socketio');
const emitMessageToUser = require("./Functions/BatchEmit");
const FollowNotificationSubscriber = async()=>{
  const io = getIo()
   
  await RedisSubscriber.subscribe('FollowNotification')

  await RedisSubscriber.on('message',async(channel,message)=>{

       if(channel=='FollowNotification'){
        const parsing = JSON.parse(message)
      emitMessageToUser(parsing.RecId,parsing.DatabaseNotification,100,'ActiveNotifications')
       // io.to(parsing.ReciverStatus).emit('ActiveNotifications',parsing.DatabaseNotification)
        console.log('Message Emited')
       }
    
  })


}


module.exports = FollowNotificationSubscriber;