import createRequest from '@/utils/createRequest'
const request = createRequest('/admin/news')
const baseRequest = createRequest('/admin')

// 新增新闻
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 上传图片
export function upload(data) {
  return baseRequest({
    url: '/file/upload',
    method: 'POST',
    data
  })
}

// 删除新闻
export function deleteNews(data) {
  return request({
    url: '/delete',
    method: 'POST',
    data
  })
}

// 获取所有新闻
export function getNews(data) {
  return request({
    url: '/selectFind',
    method: 'POST',
    data
  })
}

// 发布新闻
export function releaseNews(data) {
  return request({
    url: '/releaseNew',
    method: 'POST',
    data
  })
}

// 查詢所有內容
export function selectAll(data) {
  return request({
    url: '/selectAll',
    method: 'POST',
    data
  })
}
