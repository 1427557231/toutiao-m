import axios from 'axios'
import store from '@/store/index'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/v1_0'
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config)
    // 这里必须返回config配置对象，否则请求就停在这里出不去了
    return config
  },
  function (error) {
    // 如果请求出错了，还没有发出去，会进入这里
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default request
