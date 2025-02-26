const { consumer } = require("./KafkaConnection")

const ConnectingKafkaWorker = async()=>{
    await consumer.connect()
  //  console.log('KafkaWorker Connected')
} 

module.exports=ConnectingKafkaWorker;