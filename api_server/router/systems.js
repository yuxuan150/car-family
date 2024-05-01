
const express = require('express')
const router = express.Router()

const sys_handler = require('../router_handler/systems')

const expressJoi = require('@escook/express-joi')
// const { route } = require('./user')

//1. getCarModels
// router.get('/locations/getCarModels', sys_handler.getCarModels)
//1. getCarModels
// router.get('/getCarRecalls', sys_handler.getCarRecalls)

// router.get('/location/list', sys_handler.listLocations)
router.get('/location/list', sys_handler.listLocations)
router.get('/location/', sys_handler.getLocation)
router.put('/location/', sys_handler.updateLocation)
router.post('/location/', sys_handler.addLocation)
router.delete('/location/', sys_handler.deleteLocation)

router.get('/users/list', sys_handler.listUsers)
router.get('/users/', sys_handler.getUser)
router.put('/users/', sys_handler.updateUser)
router.post('/users/', sys_handler.addUser)
router.delete('/users/', sys_handler.deleteUser)

router.get('/company/listLite', sys_handler.listCompanySimple)

router.get('/logs/',sys_handler.getLogs)
module.exports = router