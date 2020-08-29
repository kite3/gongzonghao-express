const axios = require('axios')
const sha1 = require('sha1')
const { appId, appSecret } = require('../config')
const config = require('../config')

async function getTicket() {
  // 获取access_token
  const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  const tokenData = await axios.get(tokenUrl)
  const { access_token } = tokenData.data
  console.log('access_token:', access_token)

  // 获取jsapi_ticket
  const ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
  const ticketData = await axios.get(ticketUrl)
  console.log('jsapi_ticket:', ticketData.data.ticket)
  return ticketData.data.ticket
}

// 生成随机字符串
var createNonceStr = function () {
  return Math.random().toString(36).substring(2, 15)
}

// 生成时间戳
var createTimestamp = function () {
  return Math.floor(new Date().getTime() / 1000) + ''
}

var row = function (obj) {
  var keys = Object.keys(obj)
  keys.sort() // 字典排序

  var arr = []
  keys.forEach(key => {
    arr.push(key + '=' + obj[key])
  })
  return arr.join('')
}

// 生成signature签名等信息的方法
// 官方文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#62
var sign = async function (url) {
  let jsapi_ticket = await getTicket()
  var obj = {
    jsapi_ticket,
    noncestr: createNonceStr(),
    timestamp: createTimestamp(),
    url
  }
  var str = row(obj)
  obj.signature = sha1(str) // 生成签名
  obj.appid = config.appId
  return obj
}

module.exports = sign
