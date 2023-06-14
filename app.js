const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files (ex: bootstrapt)
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurant: restaurantList.results })
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

app.listen(port, () => {
  console.log(`Express is running on http:/localhost:${port}`)
})