const axios = require('axios')
const sha1 = require('sha1')
const { appId, appSecret } = require('../config')
const config = require('../config')

// 获取access_token
function getAccessToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  return axios.get(url).then(({ data }) => {
    const { access_token } = data
    console.log('access_token', data)
    return access_token
  })
}

// 获取jsapi_ticket
function getTicket() {
  return getAccessToken().then(access_token => {
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
    return axios.get(url).then(({ data }) => {
      const { ticket } = data
      console.log('jsapi_ticket:', data)
      return ticket
    })
  })
}

// 生成随机字符串
var createNonceStr = function () {
  return Math.random().toString(36).substring(2, 15)
}

// 生成时间戳
var createTimestamp = function () {
  return Math.floor(new Date().getTime() / 1000) + ''
}

// 生成签名
var createSignature = function (obj) {
  var keys = Object.keys(obj)
  keys.sort() // 字典排序

  var arr = []
  keys.forEach(key => {
    arr.push(key + '=' + obj[key])
  })
  return sha1(arr.join('&'))
}

// 生成signature签名等信息的方法
// 官方文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#62
var sign = function (url) {
  return getTicket().then(jsapi_ticket => {
    // 这里obj里的key必须小写
    var obj = {
      jsapi_ticket,
      noncestr: createNonceStr(),
      timestamp: createTimestamp(),
      url
    }
    obj.signature = createSignature(obj)
    obj.appid = config.appId
    return obj
  })
}

module.exports = {
  sign,
  getAccessToken
}
