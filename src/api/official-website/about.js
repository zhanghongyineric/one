import request from '@/utils/official-website-request'

// 获取所有信息
export function selectFind(data) {
  return request({
    url: '/introduce/selectFind',
    method: 'POST',
    data
  })
}

// 新增数据
export function save(data) {
  return request({
    url: '/introduce/save',
    method: 'POST',
    data
  })
}

// 新增数据
export function delData(data) {
  return request({
    url: '/introduce/delete',
    method: 'POST',
    data
  })
}

// 查詢所有內容
export function selectAll(data) {
  return request({
    url: '/introduce/selectAll',
    method: 'POST',
    data
  })
}
