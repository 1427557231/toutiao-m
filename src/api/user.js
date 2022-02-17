/* 用户相关请求模块 */

import request from '@/utils/request'

// 登录
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/authorizations',
    data
  })
}

// 发送验证码
export const sendSms = (params) => {
  return request({
    method: 'GET',
    url: `/sms/codes/${params}`
  })
}

// 获取用户自己信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/user'
  })
}

// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/user/channels'
  })
}

// 关注用户
export const addFollow = (target) => {
  return request({
    method: 'POST',
    url: '/user/followings',
    data: { target }
  })
}

// 取消关注用户
export const delFollow = (target) => {
  return request({
    method: 'DELETE',
    url: `/followings/${target}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
