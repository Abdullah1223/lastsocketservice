const express = require('express');
const FetchingChats = require('../controllers/FetchingChats');

const routeforfetchingchats = express.Router()

routeforfetchingchats.get('/',FetchingChats)



module.exports = routeforfetchingchats;