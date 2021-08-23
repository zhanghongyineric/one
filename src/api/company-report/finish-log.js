/*
 * FileName: 完结日志
 * @author: ZhouJiaXing
 * @date: 2021/5/17 下午2:03
 */
import request from '@/utils/request'

// 处理日志查询
export function fetchList(data) {
  return request({
    url: `/report/EndLogView`,
    method: 'post',
    data
  })
}
// 下载完结日志
export function downloadLog() {
  return request({
    url: `/report/endLogXlsDownload`,
    method: 'get',
    responseType: 'blob'
  })
}
