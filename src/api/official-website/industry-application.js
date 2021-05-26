import request from '@/utils/official-website-request'

// 查询行业应用数据
export function selectFind(data) {
  return request({
    url: '/trade/selectFind',
    method: 'POST',
    data
  })
}

// 新增及修改行业应用数据
export function save(data) {
  return request({
    url: '/trade/save',
    method: 'POST',
    data
  })
}

// 删除行业应用数据
export function delData(data) {
  return request({
    url: '/trade/delete',
    method: 'POST',
    data
  })
}

// 发布行业应用数据
export function release(data) {
  return request({
    url: '/trade/releaseTrade',
    method: 'POST',
    data
  })
}

// 查詢所有內容
export function selectAll(data) {
  return request({
    url: '/trade/selectAll',
    method: 'POST',
    data
  })
}
