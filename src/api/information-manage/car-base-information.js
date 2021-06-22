import request from '@/utils/information-manage-request'

// 车辆信息分页列表展示（可根据条件查询）
export function selectList(data) {
  return request({
    url: '/vehicle/selectList',
    method: 'POST',
    data
  })
}

// 模糊查询企业名称
export function enterpriseName(data) {
  return request({
    url: '/vehicle/enterpriseName',
    method: 'POST',
    data
  })
}

// 查询条件
export function queryConditions() {
  return request({
    url: '/vehicle/queryConditions',
    method: 'POST'
  })
}
