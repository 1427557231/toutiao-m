// 评论请求模块

import request from '@/utils/request'

// 获取文章评论列表
export const getComments = (params) => {
  return request({
    method: 'GET',
    url: '/comments',
    params
  })
}

// 对评论点赞
export const addCommentLike = (target) => {
  return request({
    method: 'POST',
    url: '/comment/likings',
    data: {
      target
    }
  })
}

// 取消评论点赞
export const delCommentLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/comment/likings/${target}`
  })
}

// 发布文章评论、评论回复
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: '/comments',
    data
  })
}
