// 频道请求模块

import request from '@/utils/request'

// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/channels'
  })
}

// 添加用户频道
export const addUserChannel = (channel) => {
  return request({
    method: 'PATCH',
    url: '/user/channels',
    data: {
      channels: [channel]
    }
  })
}

// 删除指定用户频道
export const delUserChannel = (channelId) => {
  return request({
    method: 'DELETE',
    url: `/user/channels/${channelId}`
  })
}
