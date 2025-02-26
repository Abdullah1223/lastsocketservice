const unMountHandle = async(socket)=>{
 
    socket.on('Unmount',(data)=>{
        console.log(data)
    })

}

module.exports = unMountHandle;