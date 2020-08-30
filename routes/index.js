var express = require('express')
var router = express.Router()
var sha1 = require('sha1')
const fs = require('fs')
const path = require('path')
var userModel = require('../db/models/Usermodel')
const config = require('../config')
const sign = require('../utils/sign')

/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readFile(path.join(__dirname, '../public/index.html'), 'utf8', (err, data) => {
    if (err) {
      res.send('index.html读取错误')
      return
    }
    res.send(data)
  })
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

// 返回js-sdk中wx.config所需的参数
router.get('/jsapi', async function (req, res, next) {
  let url = decodeURIComponent(req.query.url)
  console.log('>>>>', req.query)
  let obj = await sign(url)
  console.log('signature对象：', obj)
  res.json(obj)
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
