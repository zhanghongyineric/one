import createRequest from '@/utils/createRequest'
const request = createRequest('/monitor/alarmManagement')

// 查询主防报警类型
export function activeDefenseAlarmType() {
  return request({
    url: '/activeDefenseAlarmType',
    method: 'GET'
  })
}

// 查询卫星报警类型
export function satelliteAlarmType() {
  return request({
    url: '/satelliteAlarmType',
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

// 报警excel下载
export function alarmDowload(data) {
  return request({
    url: '/alarmDowload',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}

// 获取驾驶员信息
export function findDriver(params) {
  return request({
    url: '/findDriver',
    method: 'GET',
    params
  })
}

// 报警轨迹execl下载
export function alarmTrajectoryDowload(params) {
  return request({
    url: '/alarmTrajectoryDowload',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

// 报警轨迹
export function alarmTrajectory(data) {
  return request({
    url: '/alarmTrajectory',
    method: 'POST',
    data
  })
}

// 模糊查询企业
export function findUnitName(data) {
  return request({
    url: `/findUnitName`,
    method: 'POST',
    data
  })
}

