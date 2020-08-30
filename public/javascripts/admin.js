// 使用sunny-ngrok进行内网穿透
const API = 'http://kite3.free.idcfengye.com'

// 自定义菜单
const params = {
  button: [
    {
      type: 'view',
      name: '进入网站',
      url: 'http://kite3.free.idcfengye.com/'
    },
    {
      type: 'click',
      name: '赞一下我们',
      key: 'V1001_GOOD'
    }
  ]
}

new Vue({
  el: '#app',
  mounted() {},
  methods: {
    setMenus() {
      axios.post(API + '/admin/setMenus', params).then(({ data }) => {
        console.log(data)
      })
    }
  }
})
