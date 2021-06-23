import request from '@/utils/imformation-sync'

export function device() {
  return request({
    url: '/processDeviceData',
    method: 'GET'
  })
}

export function driver() {
  return request({
    url: '/processDriverData',
    method: 'GET'
  })
}

export function company() {
  return request({
    url: '/processCompanyData',
    method: 'GET'
  })
}

export function certificate() {
  return request({
    url: '/processTransLicData',
    method: 'GET'
  })
}

export function car() {
  return request({
    url: '/processVehicleData',
    method: 'GET'
  })
}

export function platform() {
  return request({
    url: '/processPlatformData',
    method: 'GET'
  })
}
