import createRequest from '@/utils/createRequest'
const request = createRequest('/admin/trade')

// 查询行业应用数据
export function selectFind(data) {
  return request({
    url: '/selectFind',
    method: 'POST',
    data
  })
}

// 新增及修改行业应用数据
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 删除行业应用数据
export function delData(data) {
  return request({
    url: '/delete',
    method: 'POST',
    data
  })
}

// 发布行业应用数据
export function release(data) {
  return request({
    url: '/releaseTrade',
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
