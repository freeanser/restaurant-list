// index.js 是總路由器，管理底下的 modules
const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const users = require('./modules/users')

router.use('/', home)
router.use('/restaurants', restaurant)
router.use('/users', users)

// 導出此路由
module.exports = router