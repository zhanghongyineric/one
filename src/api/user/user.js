import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
// 退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/user/getUserRole',
    method: 'get',
    params: { token }
  })
}

// 获取用户列表
export function fetchList(data) {
  return request({
    url: '/user/selectList',
    method: 'post',
    data
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
    url: '/user/add',
    method: 'post',
    data
  })
}
// 编辑账号
export function updateCount(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

// 删除账号
export function deleteCount(data) {
  return request({
    url: '/user/delete',
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
    data
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

// 获取所有字典
export function fetchAllLog(data) {
  return request({
    url: '/log/page',
    method: 'post',
    data
  })
}
