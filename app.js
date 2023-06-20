const express = require('express')
const app = express()
const port = 2000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const Restaurant = require('./models/restaurant') // 載入 res model

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

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

// 瀏覽特定餐廳
app.get("/restaurants/:restaurantId", (req, res) => {
  // console.log(req.params.restaurantId) // 這資料存在
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("show", { restaurantData }))
    .catch(err => console.log(err))
})

// 搜尋特定餐廳
app.get("/search", (req, res) => {
  if (!req.query.keywords) {
    res.redirect("/")
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  Restaurant.find({})
    .lean()
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render("index", { restaurantsData: filterRestaurantsData, keywords })
    })
    .catch(err => console.log(err))
})

// 新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
  res.render("new")
})

// 新增餐廳 之 處理頁面
app.post("/restaurants", (req, res) => { //該路由僅用於處理 POST 請求(在新增餐廳表單提交後，將資料新增到資料庫)
  Restaurant.create(req.body) // 使用 req.body 時，它可以讓你獲取到客戶端在 POST 請求中提交的資料
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 編輯餐廳頁面
app.get("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("edit", { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳 （導倒 ： 瀏覽特定餐廳）
app.post("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    //可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
    .then(() => {
      res.redirect(`/restaurants/${restaurantId}`)
      console.log(res)
    }
    )
    .catch(err => console.log(err))
})

// 刪除餐廳
app.post("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Express is running on http:/localhost:${port}`)
})