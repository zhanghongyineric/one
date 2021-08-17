import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo')

// 企业信息
export function companyNumber(data) {
  return request({
    url: '/enterprose/selectNumber',
    method: 'POST',
    data
  })
}

// 服务商信息
export function serviceNumber(data) {
  return request({
    url: '/facilitator/selectNumber',
    method: 'POST',
    data
  })
}

// 接入平台信息
export function platformNumber(data) {
  return request({
    url: '/platformInfo/selectNumber',
    method: 'POST',
    data
  })
}

// 车辆信息
export function carNumber(data) {
  return request({
    url: '/vehicle/selectNumber',
    method: 'POST',
    data
  })
}

// 驾驶员信息
export function driverNumber(data) {
  return request({
    url: '/driver/selectNumber',
    method: 'POST',
    data
  })
}
