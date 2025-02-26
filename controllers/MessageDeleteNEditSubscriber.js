const { producer } = require("../KafkaConnection/KafkaConnection");
const { RedisSubscriber } = require("../RedisConnection/ForPubSub");
const { RedisManager } = require("../RedisConnection/RedisConnection");
const emitMessageToUser = require("./Functions/BatchEmit");

const MessageDeleteNEditSubscriber = async()=>{

 await RedisSubscriber.subscribe('MessageModification')

 await RedisSubscriber.on('message',async(channel,message)=>{

    if(channel=='MessageModification'){
        const data = JSON.parse(message)
        const ReciverStatus = await RedisManager.zrange(`onlineUsers${data.reciver_id}`, 0, -1);
        const DataForSending = {
            currentuserid:data.currentuserid,
            message_id :data.message_id,
            chat_id : data.chat_id,
            uid:data.uid,
            sender_id:data.sender_id,
            reciver_id:data.reciver_id,
            message:'This Message Was Deleted',
            timestamp:data.timestamp,
            type:data.type,
            MessageForEdit:data.MessageForEdit,
            isEdit:null,
            isDelete:null,
        }
        await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(DataForSending),partition:5}]})
       console.log('producer worked here')
        if(ReciverStatus.length>0){
           
           if(data.type=='DeleteForEveryone'){
            const DeleteforEveryoneData = {...DataForSending,isDelete:true}
            await emitMessageToUser(data.reciver_id,DeleteforEveryoneData,100,'MessageDeletedForEveryone')
            await emitMessageToUser(data.sender_id,DeleteforEveryoneData,100,'MessageDeletedForEveryone')
           }
           else if(data.type=="Edit"){
            console.log('Edit Block Worked')
            const EditData = {...DataForSending,isEdit:true}
            await emitMessageToUser(data.reciver_id,EditData,100,'MessageEdited')
            await emitMessageToUser(data.sender_id,EditData,100,'MessageEdited')
            console.log('Message Edit Emmitedd')
           }else if(data.type=="DeleteForYou"){
            console.log('DeleteForYou Block Worked')
            const currentuserid  = data.currentuserid
            console.log(data.currentuserid)
            const DataForSendingDelete = {
                currentuserid,
                chat_id : data.chat_id,
                uid:data.uid,
                sender_id:data.sender_id,
                reciver_id:data.reciver_id,
                message:'This Message Was Deleted',
                timestamp:data.timestamp,
                type:data.type,
                
            }
            await emitMessageToUser(data.currentuserid,DataForSendingDelete,100,'DeleteForYou')
         console.log('Message Emitted')
        }
        }else if(ReciverStatus.length==0) {
            if(data.type=='DeleteForEveryone'){
                const DeleteforEveryoneData = {...DataForSending,isDelete:true}
                await emitMessageToUser(data.sender_id,DeleteforEveryoneData,100,'MessageDeletedForEveryone')
            }else if(data.type=='Edit'){
                console.log('Offline Message Edit Block Worked')
                const EditData = {...DataForSending,isEdit:true}
                console.log(EditData)
                await emitMessageToUser(data.sender_id,EditData,100,'MessageEdited')
                console.log('Message Edit Offline Emmitedd')
            }else if(data.type=="DeleteForYou"){
                console.log('Delete For You Block Worked')
                const currentuserid  = data.currentuserid
                const DataForSendingDelete = {
                    currentuserid,
                    chat_id : data.chat_id,
                    uid:data.uid,
                    sender_id:data.sender_id,
                    reciver_id:data.reciver_id,
                    message:'This Message Was Deleted',
                    timestamp:data.timestamp,
                    type:data.type,
                    
                }
                console.log(data.currentuserid)
                await emitMessageToUser(data.currentuserid,DataForSendingDelete,100,'DeleteForYou')
           console.log('Delete For You Message Emmited')
            }
        }
        
    }
 })

}

module.exports = MessageDeleteNEditSubscriber;