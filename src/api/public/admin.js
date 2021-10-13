/*
 * FileName: admin下公共的接口
 * @author: Jumbo
 * @createdAt: 2021/9/7 下午5:27
 */

import createRequest from '@/utils/createRequest'
const request = createRequest('/admin')

// 获取平台
export function netGetDept() {
  return request({
    url: '/sys/dept/platform/city',
    method: 'get',
  })
}
