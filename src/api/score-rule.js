/*
  积分规则
*/

import request from '@/utils/request'

// 获取列表
export function fetchList(data) {
  return request({
    url: '/rule/selectList',
    method: 'post',
    data
  })
}
// 报警名称模糊查询
export function fetchType(query) {
  return request({
    url: '/rule/selectAlarmName',
    method: 'post',
    data: {
      armName: query
    }
  })
}
// 新增规则
export function addRule(data) {
  return request({
    url: '/rule/add',
    method: 'post',
    data
  })
}
// 更新规则
export function updateRule(data) {
  return request({
    url: '/rule/update',
    method: 'post',
    data
  })
}
// 删除规则
export function deleteRule(data) {
  return request({
    url: '/rule/delete',
    method: 'post',
    data
  })
}
// 规则状态切换
export function toggleStatus(data) {
  return request({
    url: '/rule/updateState',
    method: 'post',
    data
  })
}
