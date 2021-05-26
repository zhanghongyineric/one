/*
 * FileName: report-log.js
 * @author: ZhouJiaXing
 * @date: 2021/5/7 上午11:00
 */

import request from '@/utils/request'

// 获取报备状态
export function getReportStatus() {
  return request({
    url: `/report/getReportStatus`,
    method: 'post'
  })
}
// 开始报备
export function startReport() {
  return request({
    url: `/report/beginReport`,
    method: 'post'
  })
}
// 提交报备
export function submitReport() {
  return request({
    url: `/report/commitLog`,
    method: 'post'
  })
}

// 新增违章
export function addViolation(data) {
  return request({
    url: `/report/insertReport`,
    method: 'post',
    data
  })
}
// 查询违章
export function fetchViolation(data) {
  return request({
    url: `/report/todayReportList`,
    method: 'post',
    data
  })
}
// 修改违章
export function updateViolation(data) {
  return request({
    url: `/report/updateReport`,
    method: 'post',
    data
  })
}
// 删除违章
export function deleteViolation(data) {
  return request({
    url: `/report/todayReportDelete`,
    method: 'post',
    data
  })
}
