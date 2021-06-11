import request from '@/utils/information-manage-request'

// 获取列表数据
export function selectList(data) {
  return request({
    url: '/driver/selectList',
    method: 'POST',
    data
  })
}

// 新增驾驶员
export function driverSave(data) {
  return request({
    url: '/driver/driverSave',
    method: 'POST',
    data
  })
}

// 根据驾驶员id，查询机动车驾驶证信息
export function selectDriverLic(data) {
  return request({
    url: '/driver/selectDriverLic',
    method: 'POST',
    data
  })
}
