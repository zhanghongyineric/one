import createRequest from '@/utils/createRequest'
const request = createRequest('/admin/SmallPicture')

// 查询首页小图
export function selectFind(data) {
  return request({
    url: '/selectFind',
    method: 'POST',
    data
  })
}

// 新增首页小图
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 删除首页小图
export function delData(data) {
  return request({
    url: '/delete',
    method: 'POST',
    data
  })
}
