import createRequest from '@/utils/createRequest'
const request = createRequest('/monitor/alarmManagement')

// 查询川报警类型
export function activeDefenseAlarmType() {
  return request({
    url: '/activeDefenseAlarmType',
    method: 'GET'
  })
}

// 查询川报警类型
export function enterpriseTree(data) {
  return request({
    url: '/enterpriseTree',
    method: 'POST',
    data
  })
}

// 地区
export function areaCode(data) {
  return request({
    url: '/areaCode',
    method: 'POST',
    data
  })
}

// 查询所有报警信息
export function selectAlarm(data) {
  return request({
    url: '/selectAlarm',
    method: 'POST',
    data
  })
}

// 处理报警
export function handleAlarm(data) {
  return request({
    url: '/handleAlarm',
    method: 'POST',
    data
  })
}
