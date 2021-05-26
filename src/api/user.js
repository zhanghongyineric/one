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
