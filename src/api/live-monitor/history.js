import createRequest from '@/utils/createRequest'

const request = createRequest('/monitor/trajectory')

// 获取所有点位信息
export function position(data) {
  return request({
    url: '/position',
    method: 'POST',
    data
  })
}

// 模糊搜索车牌信息
export function findPlateNum(data) {
  return request({
    url: '/findPlateNum',
    data,
    method: 'POST'
  })
}

// 分页获取车辆点位
export function pagingPosition(data) {
  return request({
    url: '/pagingPosition',
    data,
    method: 'POST'
  })
}
