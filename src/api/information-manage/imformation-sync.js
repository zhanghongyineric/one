import request from '@/utils/imformation-sync'

export function device() {
  return request({
    url: '/conversion/processDeviceData',
    method: 'POST'
  })
}

export function driver() {
  return request({
    url: '/conversion/processDriverData',
    method: 'POST'
  })
}

export function company() {
  return request({
    url: '/conversion/processCompanyData',
    method: 'POST'
  })
}

export function certificate() {
  return request({
    url: '/conversion/processTransLicData',
    method: 'POST'
  })
}

export function car() {
  return request({
    url: '/conversion/processVehicleData',
    method: 'POST'
  })
}

export function platform() {
  return request({
    url: '/conversion/processPlatformData',
    method: 'POST'
  })
}

export function gps(data) {
  return request({
    url: '/conversion/gps',
    method: 'POST',
    data
  })
}
