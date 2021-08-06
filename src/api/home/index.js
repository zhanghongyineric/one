import createRequest from '@/utils/createRequest'
const request = createRequest('/monitor/homePage')

// 安全隐患企业排行
export function enterpriseRanking(data) {
  return request({
    url: '/enterpriseRanking',
    method: 'POST',
    data
  })
}

// 车辆类型占比
export function vehicleProportion(data) {
  return request({
    url: '/vehicleProportion',
    method: 'POST',
    data
  })
}

// 重点关注车辆列表
export function keyVehicle(data) {
  return request({
    url: '/keyVehicle',
    method: 'POST',
    data
  })
}
