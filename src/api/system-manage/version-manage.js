import createRequest from '@/utils/createRequest'
const request = createRequest('/admin/version')

// 查询所有的版本数据
export function selectFind(data) {
  return request({
    url: '/selectFind',
    method: 'POST',
    data
  })
}

// 增加和修改
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 删除
export function deleteData(data) {
  return request({
    url: '/delete',
    method: 'POST',
    data
  })
}

// 启用版本
export function release(data) {
  return request({
    url: '/release',
    method: 'POST',
    data
  })
}

// 所属系统
export function sysPort(data) {
  return request({
    url: '/sysPort',
    method: 'POST',
    data
  })
}

// 查看该系统历史版本
export function historicVersion(data) {
  return request({
    url: '/historicVersion',
    method: 'POST',
    data
  })
}
