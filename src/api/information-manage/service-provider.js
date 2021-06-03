import request from '@/utils/information-manage-request'

// 查询服务商
export function selectList(data) {
  return request({
    url: '/facilitator/selectList',
    method: 'POST',
    data
  })
}

// 获取状态码
export function getStatus() {
  return request({
    url: '/facilitator/status',
    method: 'POST'
  })
}

// 新增服务商
export function save(data) {
  return request({
    url: '/facilitator/save',
    method: 'POST',
    data
  })
}

// 删除数据
export function deleteData(data) {
  return request({
    url: '/facilitator/delete',
    method: 'POST',
    data
  })
}

// 上传图片
export function upload(data) {
  return request({
    url: '/file/upload',
    method: 'POST',
    data
  })
}
