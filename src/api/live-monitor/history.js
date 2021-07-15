import createRequest from '@/utils/createRequest'

const request = createRequest('/mqtt')

export function test(data) {
  return request({
    url: `/vehicle/position`,
    method: 'POST',
    data
  })
}
