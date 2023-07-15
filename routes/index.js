// index.js 是總路由器，管理底下的 modules
const express = require('express')
const router = express.Router()

// 引入資源後，記得要使用資源
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const users = require('./modules/users')

const { authenticator } = require('../middleware/auth')

// home, todos 都是要驗證後，才能進入的
router.use('/restaurants', authenticator, restaurant)  // 條件嚴謹的放前面（要符合 /restaurant)
router.use('/users', users)
router.use('/', authenticator, home) // 條件寬鬆的放後面（要符合 / 即可）

// 導出此路由
module.exports = router