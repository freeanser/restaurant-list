const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // 先建立一個 errors[] 陣列，當碰到錯誤時，就使用 errors.push 把要顯示的訊息推進這個陣列裡。 
  // 最後我們就可以根據這個 errors[] 陣列的長度跟內容，輸出適當的系統訊息
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'Email 和 密碼 是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    // errors 可能會 = [ { message: 'Email 和 密碼 是必填。' }, { message: '密碼與確認密碼不相符！' } ]
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email })
    // 在 user 這個 collection 中，找到 email = req.body 的 使用者 user
    .then(user => {
      // 如果找到了 {  }
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword,
        })
      }
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/users/login')
})

module.exports = router