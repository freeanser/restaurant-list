const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const Restaurant = require('./models/restaurant') // 載入 res model

// 設定連線到 mongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 取得資料庫連線狀態(執行了 mongoose.connect 之後會得到一個連線狀態，我們需要設定一個參數，把連線狀態暫存下來，才能繼續使用)
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files (ex: bootstrapt)
app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.render('index', { restaurant: restaurantList.results })
// })

app.get("/", (req, res) => {
  Restaurant.find({}) // {}是一個空物件，用於指定查詢的條件。在這種情況下，空物件表示查詢不附加任何條件，即查詢所有的餐廳資料
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
})

app.get('/restaurants/:restaurant', (req, res) => {
  // console.log('req:', req.params.restaurant) // 找到 id (String)
  const id = req.params.restaurant
  const showRestaurant = restaurantList.results.find(item =>
    id === item.id.toString()) // 找到要 show 的資料
  res.render('show', { restaurant: showRestaurant })
})

app.get('/search', (req, res) => {
  // console.log('req:', req.query.keyword) // 找到 search 的關鍵字
  const keyword = req.query.keyword
  const searchRestaurant = restaurantList.results.filter(item => {
    return item.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurant: searchRestaurant, keyword: keyword })
})


// 使用者可以新增一家餐廳


// 使用者可以瀏覽一家餐廳的詳細資訊

// 使用者可以瀏覽全部所有餐廳

// 使用者可以修改一家餐廳的資訊

// 使用者可以刪除一家餐廳

app.listen(port, () => {
  console.log(`Express is running on http:/localhost:${port}`)
})