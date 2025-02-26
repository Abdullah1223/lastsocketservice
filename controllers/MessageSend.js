const { producer } = require("../KafkaConnection/KafkaConnection")
const  {RedisPublisher}  = require("../RedisConnection/ForPubSub")
const { getIo } = require("../Socketio")
const {ObjectId} = require('bson')
const { v4: uuidv4 } = require('uuid');
const ChatManager= require('../models/ChatSchema')
const emitMessageToUser = require("./Functions/BatchEmit")
const MessageSend = async(req,res)=>{
    //console.log('Message Send Route Hit')
    console.log('this is req body ')
    console.log(req.body)
    const sender_id= req.body.user._id
   const chat_id = req.body.chat_id
   const message_id='';  
   const uid = uuidv4()
   const CheckingForChats = await ChatManager.findOne({chat_id:chat_id})
   if(CheckingForChats==null){
 
    const newchat_id = req.body.reciver_id+sender_id
    //console.log("NewChat "+newchat_id)
   // console.log('Checking For Chats is Null')
       const CreatingChatId= await ChatManager.create({
        chat_id:newchat_id,
        participants:[
            {
                participant_id:sender_id
            },
            {
                participant_id:req.body.reciver_id
            }
        ],
        lastMessage:{
            message:req.body.message,
            timestamp:Date.now()
        },
        createdAt:Date.now(),
        updatedAt:Date.now()
       })
   }



    try{
        
   
    const PublishingMessages = {
        SenderName:req.body.YourName,
        chat_id:chat_id,
        uid:uid,
        sender_id:sender_id,
        reciver_id:req.body.reciver_id,
        message:req.body.message,
        timestamp:Date.now(),
        Status:req.body.Status,
        message_id:message_id,
        isFirstMessage:false,
        sortedIds:[],
    } 
    await emitMessageToUser(sender_id,PublishingMessages,100,'MessagePending')
    await RedisPublisher.publish('MESSAGES',JSON.stringify(PublishingMessages))
    return res.status(200).send({message:'Message Published'})
    }catch(err){
        console.log(err)
    }
   
}

module.exports = MessageSend