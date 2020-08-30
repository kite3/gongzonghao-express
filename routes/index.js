var express = require('express')
var router = express.Router()
var sha1 = require('sha1')
const fs = require('fs')
const path = require('path')
var userModel = require('../db/models/Usermodel')
const config = require('../config')
const { sign, createTimestamp } = require('../utils/sign')
const { toJSON, toXML } = require('../utils/xmlTool')

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

// 获取用户发送的消息（经过了微信服务器转发）
router.post('/authwx', function (req, res, next) {
  // 公众号转发过来的是xml，直接用req.body是拿不到的
  const buffers = []
  req.on('data', data => {
    buffers.push(data)
  })
  req.on('end', () => {
    const str = Buffer.concat(buffers).toString()
    toJSON(str).then(({ xml: obj }) => {
      switch (obj.MsgType) {
        // 用户发消息过来
        case 'text':
          console.log('get text:', obj)
          const resMsg = {
            xml: {
              ToUserName: obj.FromUserName,
              FromUserName: obj.ToUserName,
              CreateTime: createTimestamp(),
              MsgType: 'text',
              Content: '已收到消息，你发送的是：' + obj.Content
            }
          }
          const resXML = toXML(resMsg)
          res.send(resXML)
          break
        // 用户点击了菜单
        case 'event':
          console.log('get event:', obj)
          if (obj.Event === 'CLICK') {
            // 点击菜单“赞我们一下”
            if (obj.EventKey === 'V1001_GOOD') {
              const resMsg = {
                xml: {
                  ToUserName: obj.FromUserName,
                  FromUserName: obj.ToUserName,
                  CreateTime: createTimestamp(),
                  MsgType: 'text',
                  Content: '谢谢你的点赞！'
                }
              }
              const resXML = toXML(resMsg)
              res.send(resXML)
            }
          }
          break
      }
    })
  })
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
