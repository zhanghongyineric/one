import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/businessManagement/focusVehicles')

// 查询车辆列表
export function focusVehicles(data) {
  return request({
    url: '/selectList',
    method: 'POST',
    data
  })
}

// 新增及修改
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 删除
export function deleteVehicle(id) {
  return request({
    url: `/delete/${id}`,
    method: 'GET'
  })
}

// 模糊查询车牌号
export function selectPlateNum(plateNum) {
  return request({
    url: `/selectPlateNum/${plateNum}`,
    method: 'GET'
  })
}
