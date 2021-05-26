import request from '@/utils/official-website-request'

// 新增新闻
export function save(data) {
  return request({
    url: '/news/save',
    method: 'POST',
    data
  })
}

// 上传图片
export function upload(data) {
  return request({
    url: '/file/upload',
    method: 'POST',
    data
  })
}

// 删除新闻
export function deleteNews(data) {
  return request({
    url: '/news/delete',
    method: 'POST',
    data
  })
}

// 获取所有新闻
export function getNews(data) {
  return request({
    url: '/news/selectFind',
    method: 'POST',
    data
  })
}

// 发布新闻
export function releaseNews(data) {
  return request({
    url: '/news/releaseNew',
    method: 'POST',
    data
  })
}

// 查詢所有內容
export function selectAll(data) {
  return request({
    url: '/news/selectAll',
    method: 'POST',
    data
  })
}
