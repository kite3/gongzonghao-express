var mongoose = require('mongoose')

// 表结构对象
var userSchema = new mongoose.Schema({
  user: String,
  pwd: String
})

// 操作表结构的数据模型
var userModel = mongoose.model('userModel', userSchema)

module.exports = userModel

