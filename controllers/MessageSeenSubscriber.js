const {RedisSubscriber} = require('../RedisConnection/ForPubSub');
const { getIo } = require('../Socketio');
const emitMessageToUser = require('./Functions/BatchEmit');

const MessageSeenSubscriber = async ()=>{
  const io = getIo()
   await RedisSubscriber.subscribe('MessageSeen')
    
   await RedisSubscriber.on('message',async(channel,message)=>{

    if(channel=='MessageSeen'){
        const parsedData = JSON.parse(message)
          console.log(parsedData)
        emitMessageToUser(parsedData.sender_id,parsedData,100,'MessageSeen')

    }
   })
   
}

module.exports = MessageSeenSubscriber;