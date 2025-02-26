const {RedisSubscriber} = require('../RedisConnection/ForPubSub')
const { RedisManager } = require('../RedisConnection/RedisConnection')
const { getIo } = require("../Socketio")
const CompetitionNotification = require('../controllers/BullMqQueue/CompetitionNotificationQueue')
const emitMessageToUser = require('./Functions/BatchEmit')
const SubscriberCreation = async()=>{
      console.log('Subscriber Creation')
    const io = getIo()

      await RedisSubscriber.subscribe('Creation')

      try{
        await RedisSubscriber.on('message', async(channel,message)=>{
         
            if(channel=='Creation'){
               const parsedvalues = JSON.parse(message) 
            // console.log(parsedvalues)
            //    const SocketId= await RedisManager.hget('onlineUsers',parsedvalues.CreatorId)
            //  console.log(SocketId)
            await emitMessageToUser(parsedvalues.CreatorId,'Competition is Created',100,'Competition_Created')
           // io.to(SocketId).emit('Competition_Created','Competition is Created') 
        const Notification = "Your Competition " + parsedvalues.CompetitionName +" Has Been Created Starting Date Is"+parsedvalues.StartDate+" Ending Date is "+parsedvalues.Deadline

            await CompetitionNotification.add('CompetitionNotificationData',{Notification,CreatorId:parsedvalues.CreatorId})
            //  const Notification = [`
            //   Your Competition ${parsedvalues.CompetitionName} Has Been Created  Starting Date Is
            //   ${parsedvalues.StartDate} And Ending Date is  ${parsedvalues.Deadline}'
            //   `]      
            // io.to(SocketId).emit('CompetitionNotification',Notification)
            // console.log('Message Emitted')    
            }
        })


      }catch(err){
        console.log(err)
      }

}

module.exports = SubscriberCreation