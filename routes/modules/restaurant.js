const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 瀏覽特定餐廳
router.get("/:restaurantId", (req, res) => {
  // console.log(req.params.restaurantId) // 這資料存在
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
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
  Restaurant.create(req.body) // 使用 req.body 時，它可以讓你獲取到客戶端在 POST 請求中提交的資料
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 編輯餐廳頁面
router.get("/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("edit", { restaurantData }))
    .catch(err => console.log(err))
})

// 更新餐廳 （導到 ： 瀏覽特定餐廳）
router.put("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    //可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
    .then(() => {
      res.redirect(`/restaurants/${restaurantId}`)
      console.log(req.body)
    }
    )
    .catch(err => console.log(err))
})

// 刪除餐廳
router.delete("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 導出此路由
module.exports = router