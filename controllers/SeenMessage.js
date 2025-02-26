const emitMessageToUser = require("./Functions/BatchEmit")

const SeenMessage = async(socket)=>{

  socket.on('MessageSeen',(data)=>{
    // console.log(data)
      emitMessageToUser(data.sender_id,data,100,'userSeen')
  })


}

module.exports = SeenMessage