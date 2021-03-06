var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// 连接数据库
require('./db/connect')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var adminRouter = require('./routes/admin')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
// 后台管理路由
app.use('/admin', adminRouter)

module.exports = app
