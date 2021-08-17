import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/enterprose')

// 获取用户列表
export function fetchList(data) {
  return request({
    url: '/selectList',
    method: 'post',
    data
  })
}
// 运营状态
export function companyStatus(data) {
  return request({
    url: '/status',
    method: 'post',
    data
  })
}
// 企业运营类型
export function companyRoleStatus(data) {
  return request({
    url: '/operationType',
    method: 'post',
    data
  })
}
// 企业经济类型
export function companyEconomyStatus(data) {
  return request({
    url: '/enconomicType',
    method: 'post',
    data
  })
}
// 更新
export function updateCount(data) {
  return request({
    url: '/save',
    method: 'post',
    data
  })
}
// 新增
export function addCount(data) {
  return request({
    url: '/save',
    method: 'post',
    data
  })
}
// 删除
export function deleteCount(data) {
  return request({
    url: '/delete',
    method: 'post',
    data
  })
}

// 输入关键字 返回上级企业单位
export function upUnitName(data) {
  return request({
    url: '/upUnitName',
    method: 'post',
    data
  })
}
