import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/vehicle')
const downloadRequest = createRequest('/baseInfo')

// 车辆信息分页列表展示（可根据条件查询）
export function selectList(data) {
  return request({
    url: '/selectList',
    method: 'POST',
    data
  })
}

// 车辆信息新增和修改
export function vehicleSave(data) {
  return request({
    url: '/vehicleSave',
    method: 'POST',
    data
  })
}

// 模糊查询企业名称
export function enterpriseName(data) {
  return request({
    url: '/enterpriseName',
    method: 'POST',
    data
  })
}

// 查询条件
export function queryConditions() {
  return request({
    url: '/queryConditions',
    method: 'POST'
  })
}

// 车牌颜色
export function queryColor() {
  return request({
    url: '/queryColor',
    method: 'POST'
  })
}

// 根据车辆id查询车载入网信息
export function selectAccessInstallation(data) {
  return request({
    url: '/selectAccessInstallation',
    method: 'POST',
    data
  })
}

// 输入关键字 返回平台名称
export function platformInfoName(data) {
  return request({
    url: '/platformInfoName',
    method: 'POST',
    data
  })
}

// 输入关键字 返回平台名称
export function facilitatorName(data) {
  return request({
    url: '/facilitatorName',
    method: 'POST',
    data
  })
}

// 车载入网信息 新增 和 修改
export function AccessInstallationSave(data) {
  return request({
    url: '/AccessInstallationSave',
    method: 'POST',
    data
  })
}

// 燃料类型
export function queryFuel() {
  return request({
    url: '/queryFuel',
    method: 'POST'
  })
}

// 域名及端口
export function queryPort() {
  return request({
    url: '/queryPort',
    method: 'POST'
  })
}

// 通讯协议版本
export function queryProtocol() {
  return request({
    url: '/queryProtocol',
    method: 'POST'
  })
}

// 通讯模式
export function queryMode() {
  return request({
    url: '/queryMode',
    method: 'POST'
  })
}

// 定位模式
export function queryPositioningMode() {
  return request({
    url: '/queryPositioningMode',
    method: 'POST'
  })
}

// 根据车辆id，查询车辆运输证信息
export function selectTransport(data) {
  return request({
    url: '/selectTransport',
    method: 'POST',
    data
  })
}

// 车辆信息删除
export function vehicleDelete(data) {
  return request({
    url: '/vehicleDelete',
    method: 'POST',
    data
  })
}

// 车辆运营类型
export function queryOperationType(data) {
  return request({
    url: '/queryOperationType',
    method: 'POST',
    data
  })
}

// 车辆入网信息删除
export function AccessInstallationDelete(data) {
  return request({
    url: '/AccessInstallationDelete',
    method: 'POST',
    data
  })
}

// 保险信息新增和修改
export function InsuranceSave(data) {
  return request({
    url: '/InsuranceSave',
    method: 'POST',
    data
  })
}

// 保险信息删除
export function InsuranceDelete(data) {
  return request({
    url: '/InsuranceDelete',
    method: 'POST',
    data
  })
}

// 根据车辆id 查询保险信息
export function selectInsurance(data) {
  return request({
    url: '/selectInsurance',
    method: 'POST',
    data
  })
}

// 保险类型
export function queryInsuranceType(data) {
  return request({
    url: '/queryInsuranceType',
    method: 'POST',
    data
  })
}

// 保险险别
export function queryInsurance(data) {
  return request({
    url: '/queryInsurance',
    method: 'POST',
    data
  })
}

// 机动车的使用性质
export function queryUseNature(data) {
  return request({
    url: '/queryUseNature',
    method: 'POST',
    data
  })
}

// 车身颜色
export function queryCarColor(data) {
  return request({
    url: '/queryCarColor',
    method: 'POST',
    data
  })
}

// 下载车辆 excel
export function downloadVehicleExecl(params) {
  return downloadRequest({
    url: '/execl/downloadVehicleExecl',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}
