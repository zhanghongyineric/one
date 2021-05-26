import request from '@/utils/official-website-request'

// 新增合作伙伴
export function save(data) {
  return request({
    url: '/partners/save',
    method: 'POST',
    data
  })
}

// 获取所有合作伙伴
export function selectFind(data) {
  return request({
    url: '/partners/selectFind',
    method: 'POST',
    data
  })
}

// 删除合作伙伴
export function delPartner(data) {
  return request({
    url: '/partners/delete',
    method: 'POST',
    data
  })
}
