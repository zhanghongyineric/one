import request from '@/utils/official-website-request'

// 查询所有的版本数据
export function selectFind(data) {
  return request({
    url: '/version/selectFind',
    method: 'POST',
    data
  })
}

// 增加和修改
export function save(data) {
  return request({
    url: '/version/save',
    method: 'POST',
    data
  })
}

// 删除
export function deleteData(data) {
  return request({
    url: '/version/delete',
    method: 'POST',
    data
  })
}

// 启用版本
export function release(data) {
  return request({
    url: '/version/release',
    method: 'POST',
    data
  })
}

// 所属系统
export function sysPort(data) {
  return request({
    url: '/version/sysPort',
    method: 'POST',
    data
  })
}

// 用户界面获取版本信息
export function selectVersion(data) {
  return request({
    url: '/version/selectVersion',
    method: 'POST',
    data
  })
}

// 查看该系统历史版本
export function historicVersion(data) {
  return request({
    url: '/version/historicVersion',
    method: 'POST',
    data
  })
}
