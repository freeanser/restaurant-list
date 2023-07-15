// "config" 通常指的是配置（configuration）或設定（settings）。配置是指在應用程式中使用的各種設定、選項和參數，以便控制應用程式的行為和屬性。
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  // Strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // 這裡的 email, password 是user之前登錄時使用的資料
    User.findOne({ email })
      .then(user => {
        // 登入失敗1:
        if (!user) {
          // done(第一欄：是否有錯，有錯是err 無錯是null)
          return done(null, false, { message: "That email is not registered!" })
        }
        return bcrypt.compare(password, user.password) //user.password是經過雜湊後的
          .then(isMatch => {
            // 登入失敗2:
            if (!isMatch) {
              return done(null, false, { message: 'Email or Password incorrect.' })
            }
            // 排除失敗後，成功
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))
  // Sessions 序列與反序列
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  });

}