import createRequest from '@/utils/createRequest'

const request = createRequest('/admin')

// 查询角色列表
export function getList(data) {
  return request({
    url: `/sys/role/page`,
    method: 'post',
    data
  })
}

// 编辑角色
export function editRole(data) {
  return request({
    url: `/sys/role/edit`,
    method: 'post',
    data
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: `/sys/role/save`,
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/delete/${id}`,
    method: 'get'
  })
}

// 更新角色菜单
export function editRoleMenu(data) {
  return request({
    url: `/sys/role/menu`,
    method: 'post',
    data
  })
}

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role/list',
    method: 'GET',
    params
  })
}

