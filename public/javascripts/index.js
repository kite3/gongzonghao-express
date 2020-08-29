const API = location.href.indexOf('applinzi') > -1 ? 'http://kite3.applinzi.com' : 'http://localhost:5050'

new Vue({
  el: '#app',
  mounted() {
    this.wxconfig()
  },
  methods: {
    wxconfig() {
      axios
        .get(API + '/jsapi', {
          params: {
            url: encodeURIComponent(location.href.split('#')[0])
          }
        })
        .then(({ data }) => {
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wxac66218a8d2ab517', // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
          })

          wx.ready(() => {
            console.log('wx ready!')
          })
        })
    },
    wxScanQRCode() {
      wx.scanQRCode({
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
          console.log(result)
        }
      })
    }
  }
})
