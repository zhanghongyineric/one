import request from '@/utils/request'

// 驾驶员安全码等级查询
export function selectList(data) {
  return request({
    url: '/safeCodeLevel/selectList',
    method: 'POST',
    data
  })
}

// 驾驶员安全码修改
export function update(data) {
  return request({
    url: '/safeCodeLevel/update',
    method: 'POST',
    data
  })
}
