const express = require('express')
const MessageDeleteNEdit = require('../controllers/MessageDeleteNEdit')

const routeformessagedeletenedit = express.Router()

routeformessagedeletenedit.post('/',MessageDeleteNEdit)

module.exports = routeformessagedeletenedit;