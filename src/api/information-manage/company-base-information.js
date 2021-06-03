import request from '@/utils/information-manage-request'

// 获取用户列表
export function fetchList(data) {
  return request({
    url: '/enterprose/selectList',
    method: 'post',
    data
  })
}
// 运营状态
export function companyStatus(data) {
  return request({
    url: '/enterprose/status',
    method: 'post',
    data
  })
}
// 企业运营类型
export function companyRoleStatus(data) {
  return request({
    url: '/enterprose/operationType',
    method: 'post',
    data
  })
}
// 企业经济类型
export function companyEconomyStatus(data) {
  return request({
    url: '/enterprose/enconomicType',
    method: 'post',
    data
  })
}
// 更新
export function updateCount(data) {
  return request({
    url: '/enterprose/save',
    method: 'post',
    data
  })
}
