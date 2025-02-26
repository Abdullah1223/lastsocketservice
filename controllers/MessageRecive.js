const { producer } = require('../KafkaConnection/KafkaConnection')
const {RedisSubscriber} = require('../RedisConnection/ForPubSub')
const {RedisManager}=require('../RedisConnection/RedisConnection')
const { getIo } = require("../Socketio")
const emitMessageToUser = require('./Functions/BatchEmit')
const MessageRecive=  async ()=>{
    //console.log('Messaged Recived')
   try{
    const io =getIo()
    await RedisSubscriber.subscribe('MESSAGES')
    await RedisSubscriber.on('message', async(channel,message)=>{
         if(channel=='MESSAGES'){
            // console.log(message)
           const data = JSON.parse(message)
           const ReciverStatus = await RedisManager.zrange(`onlineUsers${data.reciver_id}`, 0, -1);
           
          //const ReciverStatus = await RedisManager.hget('onlineUsers',data.reciver_id)
        //   const SenderStatus = await RedisManager.hget('onlineUsers',data.sender_id)
         // const SenderStatus = await RedisManager.zrange(`onlineUsers${data.sender_id}`, 0, -1);

        //   console.log('Sender Status '+ SenderStatus)
          const DeletingCache = await RedisManager.del(`${data.chat_id}`)
         // console.log(data)
          const SendingData = {
            SenderName : data.SenderName,
            chat_id : data.chat_id,
            uid:data.uid,
            sender_id:data.sender_id,
            reciver_id:data.reciver_id,
            message:data.message,
            timestamp:data.timestamp,
            Status:'Sent',
            message_id:'',
            isFirstMessage:data.isFirstMessage,
            sortedIds:data.sortedIds,
           }
           const CheckingForChat = await RedisManager.hget('ActiveChats',`${data.reciver_id}`)
         
           if(CheckingForChat==null && ReciverStatus.length>0){
           //delivered
         const DeliveredData = {...SendingData,Status:'Delivered'}
         await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(DeliveredData),partition:0}]})

           }else if (CheckingForChat==data.chat_id){
             const SeenData = {...SendingData,Status:'Seen'}
             await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(SeenData),partition:0}]})
           }else if (CheckingForChat!=null && ReciverStatus.length>0){
            //delivered
            const DeliveredData = {...SendingData,Status:'Delivered'}
            await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(DeliveredData),partition:0}]})

           }else if(ReciverStatus.length==0){
            //Sent
           const SentData ={...SendingData,Status:'Sent'}
           await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(SentData),partition:0}]})
  
           }
            // if(ReciverStatus.length>0){
           
            //     await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(data),partition:0}]})
                
            // } else{
            //     await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(data),partition:0}]})
             

            // }
         }
     })
   }catch(err){
    console.log(err)
   }

}
module.exports =MessageRecive;