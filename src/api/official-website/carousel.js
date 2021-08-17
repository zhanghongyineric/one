import createRequest from '@/utils/createRequest'
const request = createRequest('/admin/carousel')

// 获取所有轮播图
export function selectFind(data) {
  return request({
    url: '/selectFind',
    method: 'POST',
    data
  })
}

// 新增轮播图
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 删除轮播图
export function deleteData(data) {
  return request({
    url: '/delete',
    method: 'POST',
    data
  })
}
