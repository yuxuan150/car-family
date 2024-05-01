
const express = require('express')
const router = express.Router()

const cars_handler = require('../router_handler/cars')

const expressJoi = require('@escook/express-joi')
const { route } = require('./user')

router.get('/model/list', cars_handler.getCarModels)

// router.get('/model/', cars_handler.getCarModels)
router.post('/model', cars_handler.addCarModel)
router.put('/model',cars_handler.updateCarModel)
//1. getCarModels
router.get('/recall/list', cars_handler.getCarRecalls)
router.get('/recall', cars_handler.getRecallById)
router.put('/recall',cars_handler.updateRecall)
router.post('/recall',cars_handler.addRecall)
router.delete('/recall',cars_handler.deleteRecall)


router.get('/getLocation', cars_handler.getLocation)

router.get('/onlineTrade',cars_handler.getTrade)
router.post('/onlineTrade',cars_handler.addTrade)
router.put('/onlineTrade',cars_handler.updateTrade)

module.exports = router