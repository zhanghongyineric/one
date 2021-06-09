import request from '@/utils/information-manage-request'

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
