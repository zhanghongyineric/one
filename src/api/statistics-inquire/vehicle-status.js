import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/statisticalQuery/vehicleStatusStatistics')

// 行政区域
export function areaCode(data) {
  return request({
    url: '/areaCode',
    method: 'POST',
    data
  })
}

// 车辆条形图统计统计
export function vehicleSystem(data) {
  return request({
    url: '/vehicleSystem',
    method: 'POST',
    data
  })
}

// 查询车辆类型
export function vehicleType(data) {
  return request({
    url: '/vehicleType',
    method: 'POST',
    data
  })
}

// 车辆类型扇形，类型入网率统计
export function sectorStatistics(data) {
  return request({
    url: '/sectorStatistics',
    method: 'POST',
    data
  })
}
