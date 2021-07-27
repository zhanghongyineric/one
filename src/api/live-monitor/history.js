import createRequest from '@/utils/createRequest'

const request = createRequest('/monitor')

export function position(data) {
  return request({
    url: `/trajectory/position`,
    method: 'POST',
    data
  })
}
