import createRequest from '@/utils/createRequest'
const request = createRequest('/monitor/message')

// 输入关键字 返回车牌
export function selectPlateNum(data) {
  return request({
    url: '/selectPlateNum',
    method: 'POST',
    data
  })
}

// 获取企业和车辆
export function unitVehicle(data) {
  return request({
    url: '/unitVehicle',
    method: 'POST',
    data
  })
}

// 入网车辆数、上线数、在线数
export function vehicleNumber(data) {
  return request({
    url: '/vehicleNumber',
    method: 'POST',
    data
  })
}
