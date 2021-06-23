import request from '@/utils/information-manage-request'

// 车辆信息分页列表展示（可根据条件查询）
export function selectList(data) {
  return request({
    url: '/vehicle/selectList',
    method: 'POST',
    data
  })
}

// 模糊查询企业名称
export function enterpriseName(data) {
  return request({
    url: '/vehicle/enterpriseName',
    method: 'POST',
    data
  })
}

// 查询条件
export function queryConditions() {
  return request({
    url: '/vehicle/queryConditions',
    method: 'POST'
  })
}

// 车牌颜色
export function queryColor() {
  return request({
    url: '/vehicle/queryColor',
    method: 'POST'
  })
}

// 根据车辆id查询车载入网信息
export function selectAccessInstallation(data) {
  return request({
    url: '/vehicle/selectAccessInstallation',
    method: 'POST',
    data
  })
}

// 输入关键字 返回平台名称
export function platformInfoName(data) {
  return request({
    url: '/vehicle/platformInfoName',
    method: 'POST',
    data
  })
}

// 输入关键字 返回平台名称
export function facilitatorName(data) {
  return request({
    url: '/vehicle/facilitatorName',
    method: 'POST',
    data
  })
}

// 车载入网信息 新增 和 修改
export function AccessInstallationSave(data) {
  return request({
    url: '/vehicle/AccessInstallationSave',
    method: 'POST',
    data
  })
}

// 燃料类型
export function queryFuel() {
  return request({
    url: '/vehicle/queryFuel',
    method: 'POST'
  })
}

// 域名及端口
export function queryPort() {
  return request({
    url: '/vehicle/queryPort',
    method: 'POST'
  })
}

// 通讯协议版本
export function queryProtocol() {
  return request({
    url: '/vehicle/queryProtocol',
    method: 'POST'
  })
}

// 通讯模式
export function queryMode() {
  return request({
    url: '/vehicle/queryMode',
    method: 'POST'
  })
}

// 定位模式
export function queryPositioningMode() {
  return request({
    url: '/vehicle/queryPositioningMode',
    method: 'POST'
  })
}

// 根据车辆id，查询车辆运输证信息
export function selectTransport(data) {
  return request({
    url: '/vehicle/selectTransport',
    method: 'POST',
    data
  })
}
