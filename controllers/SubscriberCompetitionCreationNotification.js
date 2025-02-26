const { RedisSubscriber } = require("../RedisConnection/ForPubSub");
const { RedisManager } = require("../RedisConnection/RedisConnection");
const { getIo } = require("../Socketio");
const emitMessageToUser = require("./Functions/BatchEmit");

const SubscriberCompetitionCreationNotification = async()=>{
  const io =getIo()
   try{
    const Subscribing = await RedisSubscriber.subscribe('CompetitionCreatedNotification')


    await RedisSubscriber.on('message', async(channel,message)=>{
        if(channel=="CompetitionCreatedNotification"){
           // console.log('Worked')
               const parsing = JSON.parse(message) 
               const {Notification} = parsing 
               const {CreatorId} = parsing 
               const SendingData = {
                Notification,
                _id:parsing._id,
                NotificationType:parsing.NotificationType
               }
              // console.log(CreatorId)
            //    const SocketId = RedisManager.hget('onlineUsers',CreatorId)
            //  io.to(SocketId).emit('CompetitionCreated',Notification)
            await emitMessageToUser(CreatorId,SendingData,100,'CompetitionCreated')
            // console.log(SendingData)
            // console.log('Message Emmited To Notification')
          //  console.log(message)
        }
    })
   }catch(err){
    console.log(err)
   }



}

module.exports = SubscriberCompetitionCreationNotification;