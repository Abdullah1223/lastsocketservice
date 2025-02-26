const { producer } = require("../KafkaConnection/KafkaConnection");
const MessageManager = require("../models/MessageSchema");
const { RedisManager } = require("../RedisConnection/RedisConnection");

const FetchingChatHistory = async(req,res)=>{
   if(req.params.page=='0'){
      const chat_idforredis = req.params.chat_id.trim()
      const CheckingForRedisActiveChat = await RedisManager.hget('ActiveChats',req.body.user._id)
      if(CheckingForRedisActiveChat==null){
         const SettingIntoRedis= await RedisManager.hset(`ActiveChats`,`${req.body.user._id}`,`${chat_idforredis}`) 
      }else{
         const DeletingForChatId = await RedisManager.hdel('ActiveChats',`${req.body.user._id}`)
         const SettingIntoRedis= await RedisManager.hset(`ActiveChats`,`${req.body.user._id}`,`${chat_idforredis}`) 

      }

   }
   const chat_id = req.params.chat_id?.trim()
     const CheckingForPendingMessages = await RedisManager.hgetall(`tobeSeen${req.body.user._id}${chat_id}`) 

     if(!CheckingForPendingMessages || Object.keys(CheckingForPendingMessages).length===0){
      console.log('Null')
     }else{
     
      await Promise.allSettled(
         Object.entries(CheckingForPendingMessages).map(([messageId, messageData]) => {
           const message = JSON.parse(messageData);
         console.log(message)
            return producer.send({
              topic: "MusicAppNew",
              messages: [
                {
                  
                  value: JSON.stringify({
                    message_id:message.message_id,
                    chat_id:chat_id,
                    sender_id:message.sender_id,   
                    uid:message.uid,   
                    Status: "Seen",
                  }),
                  partition:3
            
               },
              ],
            }).then(() => console.log(`Message ${messageId} sent to Kafka.`));
         })
       );
       
       // 🔥 Now, even if some messages fail, others will still be processed
       //await RedisManager.del(redisKey);
       //console.log(`All messages sent. Deleted key: ${redisKey}`);
     }
      //  const chat_id = req.params.chat_id?.trim()
       const yourid = req.body.user._id
       const pagenum = req.params.page
   //console.log(pagenum)
       const limit=5
       const skip = pagenum*limit
    if(chat_id==null){
        return res.status(200).send({Message:'No Chat Exists'})
    }
 
    const CheckCache = await RedisManager.exists(`${chat_id}`)
    if(CheckCache){
       // console.log('Sending Cache From Redis')
        const SendingToUser = await RedisManager.get(`${chat_id}page${pagenum}`)
        const findingmessages = JSON.parse(SendingToUser)
        return res.status(200).send({findingmessages,yourid})
    }
   if(pagenum==0){
      const findingmessages = await MessageManager.find({chat_id:chat_id}).populate({
         path:"sender_id reciver_id",
         select:"name",
        }).sort({timestamp:-1}).skip(skip).limit(5)
        if(findingmessages.length==0){
         return res.status(204).send()
        }
        const data = JSON.stringify(findingmessages);
         const sendingmessages = findingmessages.reverse()
        return res.status(200).send({sendingmessages,yourid})
   }else {
      const findingmessages = await MessageManager.find({chat_id:chat_id,timestamp:{$lt:pagenum}}).populate({
         path:"sender_id reciver_id",
         select:"name",
        }).sort({timestamp:-1}).skip(skip).limit(5)
        if(findingmessages.length==0){
         return res.status(204).send()
        }
        const data = JSON.stringify(findingmessages);
         const sendingmessages = findingmessages.reverse()
        return res.status(200).send({sendingmessages,yourid})
   }
   
    
}

module.exports = FetchingChatHistory;