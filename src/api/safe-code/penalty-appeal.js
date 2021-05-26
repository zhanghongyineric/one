import request from '@/utils/request'

// 申诉列表查询
export function list(data) {
  return request({
    url: '/appeal/list',
    method: 'POST',
    data
  })
}

// 申诉详情
export function detail(data) {
  return request({
    url: '/appeal/detail',
    method: 'POST',
    data
  })
}

// 扣分申诉
export function handle(data) {
  return request({
    url: '/appeal/handle',
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
