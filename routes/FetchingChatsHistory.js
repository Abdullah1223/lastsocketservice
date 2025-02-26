const express = require('express')
const FetchingChatHistory = require('../controllers/FetchingChatsHistory')

const routeforfetchingchatshistory = express.Router()


routeforfetchingchatshistory.get('/:chat_id?/:page',FetchingChatHistory)




module.exports = routeforfetchingchatshistory