import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/facilitator')

// 查询服务商
export function selectList(data) {
  return request({
    url: '/selectList',
    method: 'POST',
    data
  })
}

// 获取状态码
export function getStatus() {
  return request({
    url: '/status',
    method: 'POST'
  })
}

// 新增服务商
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 删除数据
export function deleteData(data) {
  return request({
    url: '/delete',
    method: 'POST',
    data
  })
}

// 上传图片
// export function upload(data) {
//   return request({
//     url: '/file/upload',
//     method: 'POST',
//     data
//   })
// }
