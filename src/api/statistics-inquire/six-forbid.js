import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/statisticalQuery/sixStrictlyProhibit')

// 行政区域
export function areaCode() {
  return request({
    url: '/areaCode',
    method: 'POST'
  })
}

// 六严禁报警趋势
export function SixStrictlyProhibitTrends(data) {
  return request({
    url: '/SixStrictlyProhibitTrends',
    method: 'POST',
    data
  })
}

// 六严禁报警违章类型
export function sixStrictlyProhibitViolationType(data) {
  return request({
    url: '/sixStrictlyProhibitViolationType',
    method: 'POST',
    data
  })
}

// 六严禁报警 条形图统计统计
export function sixStrictlyProhibitVehicleSystem(data) {
  return request({
    url: '/sixStrictlyProhibitVehicleSystem',
    method: 'POST',
    data
  })
}

// 六严禁报警车辆类型扇形统计
export function sectorStatistics(data) {
  return request({
    url: '/sectorStatistics',
    method: 'POST',
    data
  })
}
