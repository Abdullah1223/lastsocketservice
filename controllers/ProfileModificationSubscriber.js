const {RedisSubscriber}=require('../RedisConnection/ForPubSub')
const emitMessageToUser = require('./Functions/BatchEmit')
const ProfileModificationSubscriber = async () =>{

     await RedisSubscriber.subscribe('ProfileModification')

     await RedisSubscriber.on('message',async(channel,message)=>{
        if(channel=="ProfileModification"){
              
            const parsedData = JSON.parse(message)
            console.log(parsedData)

             if(parsedData.Type == 'Error'){
                await emitMessageToUser(parsedData._id,parsedData,100,'ProfileUpdateError')
             }
            if(parsedData.Type == 'ProfileUpdate'){
           await emitMessageToUser(parsedData._id,parsedData,100,'ProfileModification')
            }else{
                
            await emitMessageToUser(parsedData._id,parsedData,100,'ProfileModification')
            }  
        }
     })


}

module.exports = ProfileModificationSubscriber;