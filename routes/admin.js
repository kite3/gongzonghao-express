var express = require('express')
var router = express.Router()
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { getAccessToken } = require('../utils/sign')

router.get('/', function (req, res, next) {
  fs.readFile(path.join(__dirname, '../public/admin.html'), 'utf8', (err, data) => {
    if (err) {
      res.send('admin.html读取错误')
      return
    }
    res.send(data)
  })
})

router.post('/setMenus', function (req, res, next) {
  console.log('setMenus body:', req.body)
  getAccessToken().then(access_token => {
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`
    axios.post(url, req.body).then(({ data }) => {
      console.log('set menus result:', data)
      res.send(data)
    })
  })
})

module.exports = router
