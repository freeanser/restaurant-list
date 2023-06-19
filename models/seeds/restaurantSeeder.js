const mongoose = require('mongoose')
const Restaurant = require('../restaurant') // 載入 res model
const restaurantList = require("../../restaurant.json").results

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})

db.once("open", () => {
  console.log("running restaurantSeeder script...")

  Restaurant.create(restaurantList)  //將 restaurantList 中的餐廳資料插入到名為 "restaurant-list" 的 MongoDB 資料庫中的 Restaurant 集合（或稱為資料表）中。每個餐廳物件都會被轉換成一個文檔並存儲在資料庫中
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(err => console.log(err))
})