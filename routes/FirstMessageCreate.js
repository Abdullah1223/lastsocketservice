const express = require('express');
const FirstMessageCreate = require('../controllers/FirstMessageCreate');

const routeforfirstmessagecreate = express.Router()

routeforfirstmessagecreate.post('/',FirstMessageCreate)


module.exports = routeforfirstmessagecreate;