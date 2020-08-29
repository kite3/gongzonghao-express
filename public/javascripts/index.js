const API = location.href.indexOf('applinzi') > -1 ? 'http://kite3.applinzi.com' : 'http://localhost:5050'

axios.get(API + '/jsapi', {
  params: {
    url: encodeURIComponent(location.href.split('#')[0])
  }
}).then(res => {
  wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wxac66218a8d2ab517', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名
    jsApiList: [] // 必填，需要使用的JS接口列表
  })
})
