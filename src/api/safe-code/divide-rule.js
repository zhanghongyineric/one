/*
 * FileName: 规则划分
 * @author: ZhouJiaXing
 * @date: 2021/4/26 下午3:05
 */

import request from '@/utils/request'

// 查询监控分中心
export function getMonitorList(data) {
  return request({
    url: '/unit/searchMonitorCenter',
    method: 'POST'
  })
}

// 查询地区已经分配的规则
export function getDividedList(data) {
  return request({
    url: '/rule/matchList',
    method: 'POST',
    data
  })
}
// 查询地区未分配的规则
export function getUnDividedList(data) {
  return request({
    url: '/rule/notMatchList',
    method: 'POST',
    data
  })
}
// 绑定规则
export function bindRule(data) {
  return request({
    url: '/rule/match',
    method: 'POST',
    data
  })
}
// 绑定规则
export function unBindRule(data) {
  return request({
    url: '/rule/deleteMatch',
    method: 'POST',
    data
  })
}
