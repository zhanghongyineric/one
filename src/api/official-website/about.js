import createRequest from '@/utils/createRequest'
const request = createRequest('/admin/introduce')

// 获取所有信息
export function selectFind(data) {
  return request({
    url: '/selectFind',
    method: 'POST',
    data
  })
}

// 新增数据
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 新增数据
export function delData(data) {
  return request({
    url: '/delete',
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
