import Cookies from 'js-cookie'

const TokenKey = 'monitor'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  Cookies.remove(TokenKey, { domain: 'myzx.sc.cn' })// 移除政府企业端种植的cookie

  return Cookies.remove(TokenKey)
}
