const { messageconsumer } = require("./KafkaConnection")

const MessageConsumerConnected = async()=>{
    await messageconsumer.connect()
  //  console.log('MessageKafkaWorker Connected')
} 

module.exports=MessageConsumerConnected;