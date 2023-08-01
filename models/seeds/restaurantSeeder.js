const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant') // 載入 res model
const User = require('../user')
const db = require('../../config/mongoose')
const restaurantList = require("../../restaurant.json").results
const userList = require('../../user.json')

db.on('error', () => {
  console.log('mongodb error!')
})

db.once("open", () => {
  Promise.all(
    // 把 userList 的資料一筆一筆拿出來編輯
    userList.map(seedUser => {
      // return 出密碼加鹽的 user
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(seedUser.password, salt))
        .then(hash => User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash
        }))
        // 產出 restaurantList + user 的資料
        .then(user => {
          const userId = user._id
          return Promise.all(Array.from(
            { length: restaurantList.length },
            (_, i) => Restaurant.create({ ...restaurantList[i], userId })
          ))
          // return console.log('user', user, "userId", userId)
        })
    })
  )
    // Promise.all 結束，回到終端機
    .then(() => {
      console.log('done.')
      process.exit()
    })
})