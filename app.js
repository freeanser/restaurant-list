// 引入外部資源
const express = require('express')
const app = express()
const port = 2000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
// 引入資料和資料格式
const Restaurant = require('./models/restaurant') // 載入 res model
// 引入路由
const routes = require('./routes') // = const routes = require('./routes/index')

// 使用 引入的資源
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true })) // use：每一個require都需要來這裡; urlencoded：幫忙解析內容
app.use(methodOverride('_method'))
// 使用 引入的路由器
app.use(routes)

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態(執行了 mongoose.connect 之後會得到一個連線狀態，我們需要設定一個參數，把連線狀態暫存下來，才能繼續使用)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})




// 刪除餐廳
app.delete("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Express is running on http:/localhost:${port}`)
})