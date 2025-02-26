const {RedisSubscriber} = require('../RedisConnection/ForPubSub');
const { getIo } = require('../Socketio');
const emitMessageToUser = require('./Functions/BatchEmit');

const MessageDeliveredSubscribe = async ()=>{
  const io = getIo()
   await RedisSubscriber.subscribe('MessageDelivered')
    
   await RedisSubscriber.on('message',async(channel,message)=>{

    if(channel=='MessageDelivered'){
        const parsedData = JSON.parse(message)
          console.log(parsedData)
        emitMessageToUser(parsedData.sender_id,parsedData,100,'UserOnlineMessageDelivered')

    }
   })
   
}

module.exports = MessageDeliveredSubscribe;