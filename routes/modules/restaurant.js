const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// detail 瀏覽特定餐廳
router.get("/:id", (req, res) => {
  // console.log(req.params.id) // 這資料存在
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurantData => res.render("show", { restaurantData }))
    .catch(err => console.log(err))
})

// 新增餐廳頁面
router.get("/new", (req, res) => {
  res.render("new")
})

// 新增餐廳 之 處理頁面
router.post("/", (req, res) => { //該路由僅用於處理 POST 請求(在新增餐廳表單提交後，將資料新增到資料庫)
  const userId = req.user._id
  const body = req.body
  return Restaurant.create({ body, userId })
    // 使用 req.body 時，它可以讓你獲取到客戶端在 POST 請求中提交的資料
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// edit 編輯餐廳頁面
router.get("/:id/edit", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurantData => res.render("edit", { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳 （導到 ： 瀏覽特定餐廳）
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.updateOne({ _id, userId }, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})


// 刪除餐廳
router.delete("/:id", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 導出此路由
module.exports = router