import createRequest from '@/utils/createRequest'

const request = createRequest()
// const request = createRequest('/safeCode/pc')

// 登录
export function login(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    data
  })
}
// 退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
