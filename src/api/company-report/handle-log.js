/*
 * FileName: 处理日志
 * @author: ZhouJiaXing
 * @date: 2021/5/10 下午3:11
 */

import request from '@/utils/request'

// 处理日志查询
export function fetchLog(data) {
  return request({
    url: `/report/selectHandleList`,
    method: 'post',
    data
  })
}
// 处理日志详情
export function fetchLogList(data) {
  return request({
    url: `/report/selectReportList`,
    method: 'post',
    data
  })
}
// 处理违章
export function handleViolation(data) {
  return request({
    url: `/report/handleViolation`,
    method: 'post',
    data
  })
}
// 查看处理违章
export function showHandleViolation(data) {
  return request({
    url: `/report/handleView`,
    method: 'post',
    data
  })
}
// 多文件上传
export function fileUpload(data) {
  return request({
    url: `/file/upload`,
    method: 'post',
    data
  })
}
// 处理日志下载
export function downloadLog(params) {
  return request({
    url: `/report/handleLogXlsDownload`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 处理日志查看中的文件下载
export function downloadFile(params) {
  return request({
    url: `/file/download`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
