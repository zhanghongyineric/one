/*
 * FileName: 新的账号管理
 * @author: ZhouJiaXing
 * @date: 2021/6/11 下午2:39
 */

import createRequest from '@/utils/createRequest'

const request = createRequest('/admin')

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

// 获取用户列表
export function fetchList(data) {
  return request({
    url: '/sys/user/page',
    method: 'post',
    data
  })
}
// 获取部门树
export function fetchDeptTree() {
  return request({
    url: '/sys/dept/tree',
    method: 'get'
  })
}
// 获取角色树
export function fetchRoleList() {
  return request({
    url: '/sys/role/list',
    method: 'get'
  })
}

// 账号禁用
export function changeCountState(data) {
  return request({
    url: '/user/updateState',
    method: 'post',
    data
  })
}

// 新增账号
export function addCount(data) {
  return request({
    url: '/sys/user/addUser',
    method: 'post',
    data
  })
}
// 编辑账号
export function updateCount(data) {
  return request({
    url: '/sys/user/edit',
    method: 'post',
    data
  })
}

// 删除账号
export function deleteCount(data) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
    data
  })
}
// 修改密码
export function updatePassword(data) {
  return request({
    url: '/sys/user/edit/password',
    method: 'post',
    data
  })
}
// 修改账号状态
export function changeStatus(data) {
  return request({
    url: '/sys/user/changeStatus',
    method: 'post',
    data
  })
}
// 重置某个账号密码
export function resetPassword(data) {
  return request({
    url: '/sys/user/resit/password',
    method: 'post',
    data
  })
}

/*
  字典管理
*/

// 查询字典
export function fetchDictionary(data) {
  return request({
    url: '/dicts/page',
    method: 'post',
    data
  })
}

// 新增字典
export function addDictionary(data) {
  return request({
    url: '/dicts/save',
    method: 'post',
    data
  })
}

// 修改字典
export function updateDictionary(data) {
  return request({
    url: '/dicts/update',
    method: 'post',
    data
  })
}

// 删除字典
export function deleteDictionary(data) {
  return request({
    url: '/dicts/remove',
    method: 'post',
    data
  })
}

// 保存字典项
export function addDictionaryItem(data) {
  return request({
    url: '/dicts/item/save',
    method: 'post',
    data
  })
}
// 编辑字典项
export function updateDictionaryItem(data) {
  return request({
    url: '/dicts/item/update',
    method: 'post',
    data
  })
}
// 删除字典项
export function deleteDictionaryItem(data) {
  return request({
    url: '/dicts/item/remove',
    method: 'post',
    data
  })
}
// 获取字典项
export function fetchDictionaryItem(data) {
  return request({
    url: '/dicts/item/page',
    method: 'post',
    data: { ...data, pageSize: 999, pageNum: 1 }
  })
}
// 获取所有字典
export function fetchAllDictionary() {
  return request({
    url: '/dicts/getAll',
    method: 'post'
  })
}

/*
  操作日志
*/

// 查询日志
export function fetchAllLog(data) {
  return request({
    url: '/log/page',
    method: 'post',
    data
  })
}

