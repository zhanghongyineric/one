import request from '@/utils/information-manage-request'

// 获取列表数据
export function selectList(data) {
  return request({
    url: '/driver/selectList',
    method: 'POST',
    data
  })
}

// 新增驾驶员
export function driverSave(data) {
  return request({
    url: '/driver/driverSave',
    method: 'POST',
    data
  })
}

// 根据驾驶员id，查询机动车驾驶证信息
export function selectDriverLic(data) {
  return request({
    url: '/driver/selectDriverLic',
    method: 'POST',
    data
  })
}

// 根据驾驶员id，查询从业资格证信息
export function selectQualificationLic(data) {
  return request({
    url: '/driver/selectQualificationLic',
    method: 'POST',
    data
  })
}

// 删除驾驶员的信息
export function deleteDriver(data) {
  return request({
    url: '/driver/delete',
    method: 'POST',
    data
  })
}

// 从业资格证类型
export function queryQualification(data) {
  return request({
    url: '/driver/queryQualification',
    method: 'POST',
    data
  })
}

// 输入关键字返回企业名
export function enterpriseName(data) {
  return request({
    url: '/driver/enterpriseName',
    method: 'POST',
    data
  })
}

// 驾驶员状态
export function driverStatus() {
  return request({
    url: '/driver/driverStatus',
    method: 'POST'
  })
}

// 从业资格证范围
export function queryRange() {
  return request({
    url: '/driver/queryRange',
    method: 'POST'
  })
}
