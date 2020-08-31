// 使用sunny-ngrok进行内网穿透
const API = 'http://kite3.free.idcfengye.com'

var vConsole = new VConsole()

new Vue({
  el: '#app',
  mounted() {
    this.wxconfig()
    const code = getSearchValue('code')
    console.log('code from weixin:', code)
    if (!code) {
      setTimeout(() => {
        console.timeEnd('ss')
        // this.$refs.authLink.click()
      }, 2000)
    }
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
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ['scanQRCode', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
          })

          wx.ready(() => {
            console.log('wx ready!')

            //需在用户可能点击分享按钮前就先调用
            wx.updateTimelineShareData({
              title: '分享123', // 分享标题
              link: 'http://kite3.free.idcfengye.com/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: 'https://cn.vuejs.org/images/logo.png', // 分享图标
              success: function () {
                console.log('分享成功')
              }
            })

            /* ----------------------- */
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
    },
    getAuth() {
      location.href = '/getAuth'
    }
  }
})

/* 
  作用：获取location.search中的某个参数值
  假设当前url为：http://www.baidu.com?code=123#/auth
  getSearchValue('code') === '123'
*/
function getSearchValue(key) {
  const searchString = window.location.search.substring(1)
  const params = searchString.split('&')

  for (let i = 0; i < params.length; i++) {
    const val = params[i].split('=')
    if (val[0] == key) {
      return val[1]
    }
  }
  return null
}
