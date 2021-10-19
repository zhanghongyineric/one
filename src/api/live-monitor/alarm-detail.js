import createRequest from '@/utils/createRequest'
const request = createRequest('/monitor/alarmDetails')

// 行政区域
export function areaCode() {
  return request({
    url: '/areaCode',
    method: 'POST'
  })
}

// 主防报警明细
export function activeDefenseAlarm(data) {
  return request({
    url: '/alarm',
    method: 'POST',
    data
  })
}

// 输入关键字 返回企业名称
export function enterpriseName(data) {
  return request({
    url: '/enterpriseName',
    method: 'POST',
    data
  })
}

// 查询川报警类型
export function alarmType() {
  return request({
    url: '/alarmType',
    method: 'POST'
  })
}
