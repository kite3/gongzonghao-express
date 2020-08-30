var express = require('express')
var router = express.Router()
const fs = require('fs')
const path = require('path')

router.get('/', function (req, res, next) {
  fs.readFile(path.join(__dirname, '../public/admin.html'), 'utf8', (err, data) => {
    if (err) {
      res.send('admin.html读取错误')
      return
    }
    res.send(data)
  })
})

module.exports = router
