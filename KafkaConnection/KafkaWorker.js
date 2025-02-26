const { messageconsumer } = require("./KafkaConnection");
const MessageManager = require('../models/MessageSchema');
const ChatManager = require("../models/ChatSchema");
const emitMessageToUser = require("../controllers/Functions/BatchEmit");
const { RedisManager } = require("../RedisConnection/RedisConnection");
const KafkaConsumer = async()=>{

  await  messageconsumer.subscribe({topic:'MusicAppNew',fromBeginning:true,groupId:'Message_consumer'})
  let bulkOpsChat=[];
  let bulkOpsMessage=[];
  await messageconsumer.run({eachMessage:async({topic,partition,message})=>{
   // console.log(message)
    if(partition===0){
      const parsedData = JSON.parse(message.value.toString())
      console.log(parsedData)
      const {chat_id,sender_id,reciver_id,timestamp}=parsedData;
      const newmessage = parsedData.message;
      const updatedAt= Date.now(); 
     // console.log(parsedData)   
     if(parsedData.isFirstMessage==true){
      bulkOpsChat.push({
          insertOne: {
            document: {
              chat_id:parsedData.chat_id,
              participants:[
                {
                    participant_id:parsedData.sender_id
                },
                {
                    participant_id:parsedData.reciver_id
                }
            ],
              message_uid:parsedData.uid,
              lastMessage:{
                message:newmessage,
                timestamp:timestamp
            },
              
             createdAt:Date.now(),
             updatedAt:updatedAt,
             participants_sorted:parsedData.sortedIds
            },
          },
      })
     }
      else{bulkOpsChat.push({
          updateOne:{
              filter:{chat_id},
              update:{
                  $set:{
                    message_uid:parsedData.uid,
                      lastMessage:{
                          message:newmessage,
                          timestamp:timestamp
                      },
                      updatedAt:updatedAt,
                  }
              },
              // upsert:true, 
          }
      })}
      const ReciverStatus = await RedisManager.zrange(`onlineUsers${reciver_id}`, 0, -1);
      // if(ReciverStatus.length>0){
        bulkOpsMessage.push( {
          insertOne: {
            document: {
              sender_id,
              reciver_id,
              uid:parsedData.uid,
              message: newmessage,
              chat_id,
              timestamp,
              Status:parsedData.Status,
              isDelete:false,
              isEdit:false,
              DeleteFor:[],
              
            },
          },
        },); 
      //}
      // }else{
      //   bulkOpsMessage.push( {
      //     insertOne: {
      //       document: {
      //         sender_id,
      //         reciver_id,
      //         uid:parsedData.uid,
      //         message: newmessage,
      //         chat_id,
      //         timestamp,
      //         Status:'Sent'
      //       },
      //     },
      //   },);
      // }
       
       
      if(bulkOpsMessage.length>0){
        const DbOps =  await MessageManager.bulkWrite(bulkOpsMessage)
        const DbChatOps = await ChatManager.bulkWrite(bulkOpsChat)
        const idarray = Object.values(DbOps.insertedIds)
        const ForProcessedMessage = {...parsedData,message_id:idarray[0].toString()}
        await emitMessageToUser(parsedData.sender_id,ForProcessedMessage,100,'MessageProcessed')
        if(ReciverStatus.length>0){
          await emitMessageToUser(parsedData.reciver_id,parsedData,100,'Message')
        }else{
            const DataForStoringIntoRedis={
            chat_id:parsedData.chat_id,
            uid:parsedData.uid,
            message_id:idarray[0].toString(),
            sender_id:parsedData.sender_id,
            Status:'Sent'
           }  
  await RedisManager.hset(`pendingmessages${parsedData.reciver_id}`,DataForStoringIntoRedis.message_id,JSON.stringify(DataForStoringIntoRedis))

        }
        if(parsedData.Status!='Seen'){
          const DataForStoringIntoRedis={
            uid:parsedData.uid,
            message_id:idarray[0].toString(),
            sender_id:parsedData.sender_id,
            Status:'Sent'
           }  
          await RedisManager.hset(`tobeSeen${parsedData.reciver_id}${parsedData.chat_id}`,`${idarray[0].toString()}`,JSON.stringify(DataForStoringIntoRedis))
        }
        // if(ReciverStatus.length>0){
        //   const data = {
        //     SenderName : parsedData.SenderName,
        //     chat_id : parsedData.chat_id,
        //     uid:parsedData.uid,
        //     message_id:idarray[0].toString(),
        //     sender_id:parsedData.sender_id,
        //     reciver_id:parsedData.reciver_id,
        //     message:parsedData.message,
        //     timestamp:parsedData.timestamp,
        //     Status:'Delivered'
        //    }
        //   await emitMessageToUser(parsedData.reciver_id,data,100,'Message')
        //   await emitMessageToUser(parsedData.sender_id,data,100,'MessageDelivered')     
        // }else{
        //   const data = {
        //     SenderName : parsedData.SenderName,
        //     chat_id : parsedData.chat_id,
        //     message_id:idarray[0].toString(),
        //     uid:parsedData.uid,
        //     sender_id:parsedData.sender_id,
        //     reciver_id:parsedData.reciver_id,
        //     message:parsedData.message,
        //     timestamp:parsedData.timestamp,
        //     Status:'Sent'
        //    }
        //    await emitMessageToUser(parsedData.sender_id,data,100,'MessageSent')
        //    const DataForStoringIntoRedis={
        //     uid:parsedData.uid,
        //     message_id:idarray[0].toString(),
        //     sender_id:parsedData.sender_id,
        //     Status:'Sent'
        //    }     
        //    await RedisManager.hset(`pendingmessages${parsedData.reciver_id}`,DataForStoringIntoRedis.message_id,JSON.stringify(DataForStoringIntoRedis))
           
        // }
          if(DbOps && DbChatOps){
              bulkOpsChat=[];
              bulkOpsMessage=[];
          }
      }
    }
 
  }})
}


module.exports =KafkaConsumer;