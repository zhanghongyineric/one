import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/statisticalQuery/activeDefense')

// 行政区域
export function areaCode() {
  return request({
    url: '/areaCode',
    method: 'POST'
  })
}

// 主防报警车辆类型
export function alarmsVehicleType() {
  return request({
    url: '/alarmsVehicleType',
    method: 'POST'
  })
}

// 主防报警趋势
export function alarmsVehicleTrends(data) {
  return request({
    url: '/alarmsVehicleTrends',
    method: 'POST',
    data
  })
}

// 主防报警车辆类型扇形统计
export function sectorStatistics(data) {
  return request({
    url: '/sectorStatistics',
    method: 'POST',
    data
  })
}

// 主防报警 条形图统计统计
export function alarmsVehicleSystem(data) {
  return request({
    url: '/alarmsVehicleSystem',
    method: 'POST',
    data
  })
}
