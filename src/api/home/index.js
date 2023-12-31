import createRequest from '@/utils/createRequest'
const request = createRequest('/monitor/homePage', 60000)

// 安全隐患企业排行
export function enterpriseRanking(data) {
  return request({
    url: '/enterpriseRanking',
    method: 'POST',
    data
  })
}

// 车辆类型占比
export function vehicleProportion(data) {
  return request({
    url: '/vehicleProportion',
    method: 'POST',
    data
  })
}

// 重点关注车辆列表
export function keyVehicle(data) {
  return request({
    url: '/keyVehicle',
    method: 'POST',
    data
  })
}

// 服务商考核分析
export function facilitatorAssessmentAnalysis(data) {
  return request({
    url: '/facilitatorAssessmentAnalysis',
    method: 'POST',
    data
  })
}

// 机构考核分析
export function mechanismAssessmentAnalysis(data) {
  return request({
    url: '/mechanismAssessmentAnalysis',
    method: 'POST',
    data
  })
}

// 企业考核分析
export function unitAssessmentAnalysis(data) {
  return request({
    url: '/unitAssessmentAnalysis',
    method: 'POST',
    data
  })
}

// 地图展示车辆
export function onlineVehicle() {
  return request({
    url: '/onlineVehicle',
    method: 'GET'
  })
}

// 趋势分析
export function trendAnalysis(params) {
  return request({
    url: '/trendAnalysis',
    method: 'GET',
    params
  })
}

// 报警事件
export function alarmEvent(data) {
  return request({
    url: '/alarmEvent',
    method: 'POST',
    data
  })
}

// 市级平台展示车辆
export function cityVehicle(params) {
  return request({
    method: 'GET',
    url: '/cityVehicle',
    params
  })
}

// 根据平台id，返回平台名称
export function platformName(params) {
  return request({
    url: '/platformName',
    method: 'GET',
    params
  })
}

