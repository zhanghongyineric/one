import createRequest from '@/utils/createRequest'

const request = createRequest('/monitor/trajectory')

export function position(data) {
  return request({
    url: '/position',
    method: 'POST',
    data
  })
}

export function findPlateNum(data) {
  return request({
    url: '/findPlateNum',
    data,
    method: 'POST'
  })
}
