import createRequest from '@/utils/createRequest'

const request = createRequest('/mqtt')

export function position(data) {
  return request({
    url: `/vehicle/position`,
    method: 'POST',
    data
  })
}
