import request from '@/utils/imformation-sync'

export function device() {
  return request({
    url: '/mysql/processDeviceData',
    method: 'GET'
  })
}

export function driver() {
  return request({
    url: '/mysql/processDriverData',
    method: 'GET'
  })
}

export function company() {
  return request({
    url: '/mysql/processCompanyData',
    method: 'GET'
  })
}

export function certificate() {
  return request({
    url: '/mysql/processTransLicData',
    method: 'GET'
  })
}

export function car() {
  return request({
    url: '/mysql/processVehicleData',
    method: 'GET'
  })
}

export function platform() {
  return request({
    url: '/mysql/processPlatformData',
    method: 'GET'
  })
}
