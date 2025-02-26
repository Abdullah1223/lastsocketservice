const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId},
    //chat_id:{type:mongoose.Schema.Types.ObjectId},
    message_uid:{type:String},
    chat_id:{type:String},
    participants:[
      {participant_id:{type:mongoose.Schema.Types.ObjectId,ref:'users'}}
    ],
     lastMessage:{
        message:{type:String},
        timestamp:{type:Date},
    },
    createdAt:{type:Date},
    updatedAt:{type:Date},
     participants_sorted: {
    type: [mongoose.Schema.Types.ObjectId],
    index: true,
    unique: true,
    validate: [val => val.length === 2, "Requires exactly 2 participants"]
  }
})

ChatSchema.index({ "participants.participant_id": 1 });

// Create index on updatedAt
ChatSchema.index({ updatedAt: -1 });

// Create a composite index on both
ChatSchema.index({ "participants.participant_id": 1, updatedAt: -1 });

const ChatManager = mongoose.model('chats',ChatSchema);

module.exports = ChatManager;
