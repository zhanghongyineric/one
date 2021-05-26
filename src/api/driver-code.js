/*
  驾驶员安全码
*/

import request from '@/utils/request'

// 获取列表
export function fetchList(data) {
  return request({
    url: '/driverSafeCode/selectList',
    method: 'post',
    data
  })
}
// 获取驾驶员信息
export function fetchDriver(data) {
  return request({
    url: '/driver/select',
    method: 'post',
    data
  })
}
// 获取饼图
export function fetchPieChart(data) {
  return request({
    url: '/driver/riskPie',
    method: 'post',
    data
  })
}
// 获取不安全驾驶行为
export function fetchUnsafe(data) {
  return request({
    url: '/driver/safeStatisticsWeek',
    method: 'post',
    data
  })
}
// 获取折线图数据
export function fetchLineChart(data) {
  return request({
    url: '/driver/safeStatisticsYear',
    method: 'post',
    data
  })
}
// 驾驶员扣分统计
export function fetchViolation(data) {
  return request({
    url: '/driver/violation',
    method: 'post',
    data
  })
}

