// 引入外部套件
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('connect-flash')

require('dotenv').config()

// 僅在非正式環境時，使用dotenv //要放在入口
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 引用自己定義好的設定
const routes = require('./routes') // = const routes = require('./routes/index')
const port = 2000

const usePassport = require('./config/passport')
require('./config/mongoose')

// 使用套件產生的東西
const app = express()

// 使用 引入的資源
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // resave: 每次跟使用者互動，都會強制更新 session
  saveUninitialized: true // 儲存新的 session
}))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
// use：每一個require都需要來這裡; urlencoded：幫忙解析內容
app.use(methodOverride('_method'))

usePassport(app) // 因為 passport 最後是輸出一個 function
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})