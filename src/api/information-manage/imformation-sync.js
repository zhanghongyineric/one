import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfoJob/conversion')

export function device() {
  return request({
    url: '/processDeviceData',
    method: 'POST'
  })
}

export function driver() {
  return request({
    url: '/processDriverData',
    method: 'POST'
  })
}

export function company() {
  return request({
    url: '/processCompanyData',
    method: 'POST'
  })
}

export function certificate() {
  return request({
    url: '/processTransLicData',
    method: 'POST'
  })
}

export function car() {
  return request({
    url: '/processVehicleData',
    method: 'POST'
  })
}

export function platform() {
  return request({
    url: '/processPlatformData',
    method: 'POST'
  })
}

export function gps(data) {
  return request({
    url: '/gps',
    method: 'POST',
    data
  })
}
