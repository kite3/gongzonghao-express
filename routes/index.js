var express = require('express')
var router = express.Router()
var userModel = require('../db/models/Usermodel')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express 123888' })
})

router.post('/testdb', function (req, res, next) {
  const { user, pwd } = req.body
  console.log(req.body)
  // 将user、pwd存入数据库
  new userModel({
    user: user,
    pwd: pwd
  })
    .save()
    .then(() => {
      res.send({ code: 1, msg: '注册成功' })
    })
})

module.exports = router
