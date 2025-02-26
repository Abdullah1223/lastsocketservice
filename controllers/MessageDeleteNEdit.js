const { RedisPublisher } = require("../RedisConnection/ForPubSub");

const MessageDeleteNEdit = async (req,res)=>{
   console.log('MessageDelete n Edit Worked')
    const {type}=req.body
    const currentuserid = req.body.user._id
    console.log('This is current user id ' + currentuserid)
    const message_id=req.body.DataForModification._id;
    //console.log(message_id)
    const uid=req.body.DataForModification.uid;
    const chat_id = req.body.DataForModification.chat_id;
    const message  = req.body.DataForModification.message;
    const timestamp = req.body.DataForModification.timestamp
    const sender_id =req.body.DataForModification.sender_id._id || req.body.DataForModification.sender_id
    const reciver_id = req.body.DataForModification.reciver_id._id || req.body.DataForModification.reciver_id
    const MessageForEdit = req.body.MessageForEdit
    
    const DataForPublishing = {
        currentuserid,
        sender_id,
        reciver_id,
        message_id,
        uid,
        chat_id,
        message,
        timestamp,
        type,
        MessageForEdit
    } 
    await RedisPublisher.publish('MessageModification',JSON.stringify(DataForPublishing))
    // if(type=='DeleteForYou'){
    
    // }else if(type=='DeleteForEveryone'){

    // }else{

    // }
    return res.status(200).send({Message:'Message Published'})
}


module.exports = MessageDeleteNEdit