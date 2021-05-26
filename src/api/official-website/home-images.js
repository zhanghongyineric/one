import request from '@/utils/official-website-request'

// 查询首页小图
export function selectFind(data) {
  return request({
    url: '/SmallPicture/selectFind',
    method: 'POST',
    data
  })
}

// 新增首页小图
export function save(data) {
  return request({
    url: '/SmallPicture/save',
    method: 'POST',
    data
  })
}

// 删除首页小图
export function delData(data) {
  return request({
    url: '/SmallPicture/delete',
    method: 'POST',
    data
  })
}
