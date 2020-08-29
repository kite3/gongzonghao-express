var express = require('express')
var router = express.Router()
var sha1 = require('sha1')
var userModel = require('../db/models/Usermodel')
const config = require('../config')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express 123888' })
})

// 验证消息是否来自微信服务器
router.get('/authwx', function (req, res, next) {
  const { signature, timestamp, nonce, echostr } = req.query
  const { token } = config
  let array = [timestamp, nonce, token]
  array.sort() // 字典排序
  let str = sha1(array.join(''))
  if (str === signature) {
    res.set('Content-Type', 'text/plain')
    res.send(echostr)
  } else {
    res.send('Error！不是来自微信服务器!!!!!')
  }
})

// 获取js-sdk中wx.config所需的参数
router.get('/jsapi', function (req, res, next) {})

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
