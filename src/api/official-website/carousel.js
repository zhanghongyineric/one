import request from '@/utils/official-website-request'

// 获取所有轮播图
export function selectFind(data) {
  return request({
    url: '/carousel/selectFind',
    method: 'POST',
    data
  })
}

// 新增轮播图
export function save(data) {
  return request({
    url: '/carousel/save',
    method: 'POST',
    data
  })
}

// 删除轮播图
export function deleteData(data) {
  return request({
    url: '/carousel/delete',
    method: 'POST',
    data
  })
}
