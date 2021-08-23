import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/region')

// 查询所有行政区域
export function selectRegionCode(data) {
  return request({
    url: '/selectRegionCode',
    method: 'POST',
    data
  })
}

// 增加及修改行政区域
export function save(data) {
  return request({
    url: '/save',
    method: 'POST',
    data
  })
}

// 删除行政区域
export function deleteRegions(data) {
  return request({
    url: '/delete',
    method: 'POST',
    data
  })
}

// 上级企业单位
export function upUnitName(data) {
  return request({
    url: '/upUnitName',
    method: 'POST',
    data
  })
}
