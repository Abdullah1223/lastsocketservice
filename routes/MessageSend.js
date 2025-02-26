const express = require('express');
const MessageSend = require('../controllers/MessageSend');

const routeformessagesend = express.Router()

routeformessagesend.post('/',MessageSend)

module.exports =routeformessagesend;