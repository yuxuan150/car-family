
const express = require('express')
const router = express.Router()

const das_handler = require('../router_handler/dashboard')

const expressJoi = require('@escook/express-joi')
const { route } = require('./user')

 
router.get('/',das_handler.getDashBoard)

module.exports = router