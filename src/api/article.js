import request from '@/utils/request'

// 获取文章新闻推荐
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/articles',
    params
  })
}

// 获取文章详情
export const getArticleById = (articleId) => {
  return request({
    method: 'GET',
    url: `/articles/${articleId}`
  })
}

// 收藏文章
export const addCollected = (target) => {
  return request({
    method: 'POST',
    url: '/article/collections',
    data: {
      target
    }
  })
}

// 取消收藏
export const delCollected = (target) => {
  return request({
    method: 'DELETE',
    url: `/article/collections/${target}`
  })
}

// 点赞
export const addLike = (target) => {
  return request({
    method: 'POST',
    url: '/article/likings',
    data: {
      target
    }
  })
}

// 取消点赞
export const delLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/article/likings/${target}`
  })
}
