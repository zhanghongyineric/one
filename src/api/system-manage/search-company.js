import createRequest from '@/utils/createRequest'
const request = createRequest('')

// 通过公司名字进行模糊查询
export function searchCompany(params) {
  return request({
    url: `/user/selectNameVague/${params}`,
    method: 'get'
  })
}

