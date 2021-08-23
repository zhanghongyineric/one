/*
 * FileName: gov-dashboard.js
 * @author: ChenHaiPing
 * @date: 2021/4/16 下午5:05
 */

import request from '@/utils/request'

// 获得本周企业安全码变化
export function fetchCodeChange(data) {
  return request({
    url: '/government/unitSafeCodeChange',
    method: 'post',
    data
  })
}
// 获得本周企业安全码变化
export function fetchSafeRatio(data) {
  return request({
    url: '/government/allUnitSafeCodeRatio',
    method: 'post',
    data
  })
}
// 连续两周以上的红码企业
export function fetchRedCompany(data) {
  return request({
    url: '/government/selectRedCodeEnterprise',
    method: 'post',
    data
  })
}
// 连续两周以上的绿码企业
export function fetchGreenCompany(data) {
  return request({
    url: '/government/selectGreenCodeEnterprise',
    method: 'post',
    data
  })
}
// 安全码热力图（所有企业安全码颜色）
export function getCodePoint(area) {
  return request({
    url: '/unitSafeCode/selectList',
    method: 'POST',
    data: {
      colorId: '1,2,3,4',
      keyWord: '',
      area,
      categoryId: '',
      status: 1
    }
  })
}
