const ChatManager = require("../models/ChatSchema");
const UserManager = require('../models/UserSchema')
const FetchingChats = async (req, res) => {
   const currentuserid = req.body.user?._id;
    
   try {
     //This Query Name Be Reduced By putting name into Jwt 
      const FindingUsername = await UserManager.findOne({_id:currentuserid}).select('name _id')
      //console.log(FindingUsername)
      // Query for chats where `participants.participant_id` matches the current user ID
      const FindingForChats = await ChatManager.find({
        "participants.participant_id": currentuserid,
      })
        .sort({ updatedAt: -1 })
        .populate({
          path: "participants.participant_id", // Populate the `participant_id` field
         // Exclude the current user
          select: "name image role", // Select specific fields
        });
       const mapping = await FindingForChats.map((data)=>{

        const filtering = data.participants.filter(p=>p.participant_id._id!=currentuserid)
        
        const participantsData = filtering.map((p) => ({
            participant_id: p.participant_id._id,
            name: p.participant_id.name,
            role: p.participant_id.role,
          }));
  
          // Return the chat object with relevant data, including the last message and participant details
          return {
            YourName:FindingUsername.name,
            YourId:FindingUsername._id,
            chat_id: data.chat_id, // Chat ID
            lastMessage: data.lastMessage, // Last message
            participants: participantsData, // Include participants directly in the chat object
            updatedAt: data.updatedAt, // Updated timestamp
          };
        })
        
         
     
       //console.log(mapping)
      if (FindingForChats.length !== 0) {
        return res.status(200).send(mapping);
      } else {
        return res.status(404).send({ Message: "No Chats Found" });
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      return res.status(500).send({ Message: "Internal Server Error", Error: err });
    }
  };
  
  module.exports = FetchingChats;
  