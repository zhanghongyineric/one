import createRequest from '@/utils/createRequest'
const request = createRequest('/admin/partners')

// 新增合作伙伴
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 获取所有合作伙伴
export function selectFind(data) {
  return request({
    url: '/selectFind',
    method: 'POST',
    data
  })
}

// 删除合作伙伴
export function delPartner(data) {
  return request({
    url: '/delete',
    method: 'POST',
    data
  })
}
