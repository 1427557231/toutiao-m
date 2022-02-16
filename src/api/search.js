import request from '@/utils/request'

// 获取联想建议
export const getSuggestions = (q) => {
  return request({
    method: 'GET',
    url: '/suggestion',
    params: {
      q
    }
  })
}

// 获取搜索结果
export const getResults = (params) => {
  return request({
    method: 'GET',
    url: '/search',
    params
  })
}
