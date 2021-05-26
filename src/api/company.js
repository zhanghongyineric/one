import request from '@/utils/request'

// 通过公司名字进行模糊查询
export function searchCompany(params) {
  return request({
    url: `/user/selectNameVague/${params}`,
    method: 'get'
  })
}
