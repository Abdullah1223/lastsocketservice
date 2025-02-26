// const { getIo } = require("../Socketio");

const { RedisManager } = require("../RedisConnection/RedisConnection");
const emitMessageToUser = require("./Functions/BatchEmit");

const OnlineStatus = async(socket)=>{
    //console.log(socket.user._id)
  
  socket.on('CallForOnlineStatusCheck',async(data)=>{
    console.log(data)
    const ReciverStatus = await RedisManager.zrange(`onlineUsers${data.reciver_id}`, 0, -1);
    if(ReciverStatus.length>0){
      const UserStatus = 'Online'
      emitMessageToUser(socket.user?._id,UserStatus,100,'UserStatus')
    }else{
      const UserStatus = 'Offline'
      emitMessageToUser(socket.user?._id,UserStatus,100,'UserStatus')
    }

  })



}

module.exports =OnlineStatus;