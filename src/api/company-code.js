import request from '@/utils/request'

// 查询企业列表
export function fetchList(data) {
  return request({
    url: `/unitSafeCode/selectList`,
    method: 'post',
    data
  })
}
// 获取企业类别
export function companyType() {
  return request({
    url: `/unitType`,
    method: 'post'
  })
}

// 获取企业信息
export function fetchCompany(data) {
  return request({
    url: '/unit/select',
    method: 'post',
    data
  })
}
// 完善企业信息
export function finishCompany(data) {
  return request({
    url: '/unit/updateInformation',
    method: 'post',
    data
  })
}
// 获取不安全驾驶行为
export function fetchUnsafe(data) {
  return request({
    url: '/unit/safeStatisticsWeek',
    method: 'post',
    data
  })
}
// 获取本周期企业的驾驶员安全码变化
export function fetchWeekCodeChange(data) {
  return request({
    url: '/unit/safeCodeChange',
    method: 'post',
    data
  })
}
// 获取周占比
export function fetchWeekRadio(data) {
  return request({
    url: '/unit/selectSafeProportion',
    method: 'post',
    data
  })
}

// 获取本季度企业的驾驶员安全码占比
export function fetchMonthRadio(data) {
  return request({
    url: '/unit/safeCodeRatio',
    method: 'post',
    data
  })
}
// 获取本周期驾驶员安全码转化
export function fetchCodeTransform(data) {
  return request({
    url: '/unit/codeTransform',
    method: 'post',
    data
  })
}

// 获取折线图数据
export function fetchLineChart(data) {
  return request({
    url: '/unit/safeStatisticsYear',
    method: 'post',
    data
  })
}
// 企业安全码规则查询
export function fetchSafeCodeRatio(data) {
  return request({
    url: '/unit/weight',
    method: 'post',
    data
  })
}
// 增加企业权重规则
export function fetchCreate(data) {
  return request({
    url: '/unit/addWeight',
    method: 'post',
    data
  })
}
// 修改企业权重规则
export function fetchRevise(data) {
  return request({
    url: '/unit/updateWeight',
    method: 'post',
    data
  })
}
// 删除企业权重规则
export function fetchDelete(data) {
  return request({
    url: '/unit/deleteWeight',
    method: 'post',
    data
  })
}
// 启用或禁用企业权重规则
export function fetchChange(data) {
  return request({
    url: '/unit/updateStatus',
    method: 'post',
    data
  })
}
// 企业车辆查询
export function fetchCar(data) {
  return request({
    url: '/unit/vehicle',
    method: 'post',
    data
  })
}

