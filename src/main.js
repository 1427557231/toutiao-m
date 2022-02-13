import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式
import '@/styles/index.less'

// 导入vant组件
import Vant from 'vant'
import 'vant/lib/index.css'

// 设置动态rem基准值
import 'lib-flexible/flexible.js'

// 注册Vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
