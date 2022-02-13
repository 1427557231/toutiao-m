import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'

Vue.use(Vuex)

// 定义一个常量来输入token，如果是起的字符串，系统不会报错，如果是常量系统就会报错
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息，token等信息
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，需要存储到本地
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
