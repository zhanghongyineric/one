import request from '@/utils/request'

// 用户密码修改
export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'POST',
    data
  })
}
