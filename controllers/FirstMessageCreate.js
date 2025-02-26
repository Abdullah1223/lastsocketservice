const { default: mongoose } = require('mongoose')
const ChatManager = require('../models/ChatSchema')
const UserManager = require('../models/UserSchema')
const { v4: uuidv4 } = require('uuid');
const { RedisPublisher } = require('../RedisConnection/ForPubSub');
const FirstMessageCreate = async(req,res)=>{
  const sender_id = req.body.user?._id
  const reciver_id = req.body.reciver_id
  const uid = uuidv4()
  const message_id=''
  console.log(req.body)
  console.log('This is Sender Id' + sender_id)
  console.log( 'This is Reciver Id' +  reciver_id )

  const sortedIds = [sender_id, reciver_id]
    .map(id => id.toString())
    .sort()
    .map(id => new mongoose.Types.ObjectId(id));
     
    const FindingUsername = await UserManager.findOne({_id:sender_id}).select('name')
    const YourName = FindingUsername
    const Finding =await ChatManager.findOne({participants_sorted:sortedIds})
    console.log(Finding)
    
    if(Finding==null){
        const Chatuid = uuidv4()
        const PublishingMessages = {
            SenderName:YourName,
            chat_id:Chatuid,
            uid:uid,
            sender_id:sender_id,
            reciver_id:reciver_id,
            message:req.body.message,
            timestamp:Date.now(),
            Status:req.body.Status,
            message_id:message_id,
            isFirstMessage:true,
            sortedIds:sortedIds
        } 
        await RedisPublisher.publish('MESSAGES',JSON.stringify(PublishingMessages))

    }else {
        
    const PublishingMessages = {
        SenderName:YourName,
        chat_id:Finding.chat_id,
        uid:uid,
        sender_id:sender_id,
        reciver_id:reciver_id,
        message:req.body.message,
        timestamp:Date.now(),
        Status:req.body.Status,
        message_id:message_id,
        isFirstMessage:false,
        sortedIds:[]
    } 
    await RedisPublisher.publish('MESSAGES',JSON.stringify(PublishingMessages))
    }
    
//   const Finding = await ChatManager.findOne({
//     "participants.participant_id": { $all: [sender_id, reciver_id] }
//   });
 
//   console.log(Finding)
  return res.status(200).send({Message:'Working'})
}

module.exports = FirstMessageCreate;
