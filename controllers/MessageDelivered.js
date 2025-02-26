const { producer } = require('../KafkaConnection/KafkaConnection');
const  { RedisManager }=require('../RedisConnection/RedisConnection')
const MessageDelivered =async(userId)=>{
    const pendingMessages = await RedisManager.hgetall(`pendingmessages${userId}`);

    if (!pendingMessages || Object.keys(pendingMessages).length === 0) {
      console.log('No pending messages for user:', userId);
      return;
    }

    // Track all pending message processing
    let allMessagesProcessed = true;

    // Loop through pending messages and process them
    for (const [key, messageData] of Object.entries(pendingMessages)) {
      const message = JSON.parse(messageData);
      const { message_id, sender_id, Status,uid,chat_id } = message;

      try {
        // Update message status to Delivered
        message.Status = 'Delivered';

        // Produce to Kafka for further processing (optional)
        await producer.send({
          topic: 'MusicAppNew',
          messages: [
            {
              value: JSON.stringify({ message_id, sender_id, Status: message.Status,uid,chat_id:chat_id }),
              partition:3 
            },
          ],
          
        });

        // console.log(`Message delivered to user ${userId}:`, message);

        // // Emit to the sender in real-time
        // const senderSocket = io.sockets.sockets.get(sender_id);
        // if (senderSocket) {
        //   senderSocket.emit('messageDelivered', { message_id, Status: message.Status });
        //   console.log(`Emitted delivery acknowledgment to sender ${sender_id}`);
        // }
      } catch (error) {
        allMessagesProcessed = false;
        console.error(`Error processing message ${message_id}:`, error);
      }
    }

    // Delete pending messages only if all have been processed successfully
    if (allMessagesProcessed) {
      await RedisManager.del(`pendingmessages${userId}`);
      console.log(`Deleted all pending messages for user ${userId}`);
    } else {
      console.log('Some messages failed to process, pending deletion.');
    }
 

  
}

module.exports = MessageDelivered;