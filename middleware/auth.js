module.exports = {
  authenticator: (req, res, next) => {
    // 如果 req 已經被驗證，就往 next 前進
    if (req.isAuthenticated()) {
      return next()
    }
    // 如果沒有被驗證，就回去這裡
    req.flash('warning_msg', '請先登入才能使用！')
    res.redirect('/users/login')
  }
}

// router.use('/', authenticator, home)
// 先去 authenticator 發現有被驗證，就會往 next() 前進，也就是往 home 前進