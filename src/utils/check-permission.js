/*
  判断是否展示操作、查询等按钮
*/
import store from '@/store'

export function checkPermission(operation) {
  const permission = {
    admin: ['edit', 'search'], // 管理员
    gov: ['search'], // 政府
    unit: [] // 企业
  }
  const role = store.getters && store.getters.role

  if (!operation) {
    console.error('缺少参数 operation')
    return false
  }
  return permission[role] && permission[role].includes(operation)
}
