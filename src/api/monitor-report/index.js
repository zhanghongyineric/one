import createRequest from '@/utils/createRequest'

const request = createRequest('')

// 获取周
export function netGetWeek(params) {
  return request({
    url: '/admin/safereport/week',
    method: 'get',
    params
  })
}

// 获取周报数据
export function netGetWeekData(params) {
  return request({
    url: '/admin/safereport/monitor/weekly',
    method: 'get',
    params
  })
}

/* // 获取违章报警排名统计
export function fetchViolationTopTen(params) {
  return request({
    url: '/admin/safereport/violationrank',
    method: 'get',
    params
  })
}
// 获取车辆违章报警排名统计
export function fetchVehicleTopTenData(params) {
  return request({
    url: '/admin/safereport/vehicleviolationrank',
    method: 'get',
    params
  })
}
// 车辆违章类型报警趋势图表
export function fetchVehicleTendencyChart(params) {
  return request({
    url: '/admin/safereport/violationcount/trend',
    method: 'get',
    params
  })
}
// 车辆违章类型报警趋势表格
export function fetchVehicleTendencyTable(params) {
  return request({
    url: '/admin/safereport/violationcount',
    method: 'get',
    params
  })
}
// 危险驾驶事件统计
export function fetchDangerDrive(params) {
  return request({
    url: '/admin/safereport/alarmcount',
    method: 'get',
    params
  })
}
// 车辆基本情况统计
export function fetchVehicleStatistics(params) {
  return request({
    url: '/admin/safereport/vehiclebaseinfo',
    method: 'get',
    params
  })
}
// 区县车辆情况统计
export function fetchRegionVehicle(params) {
  return request({
    url: '/admin/safereport/regionvehicleinfo',
    method: 'get',
    params
  })
}*/
