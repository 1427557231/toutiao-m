import request from '@/utils/request'

// 获取文章新闻推荐
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/articles',
    params
  })
}
