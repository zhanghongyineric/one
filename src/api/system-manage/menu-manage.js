import createRequest from '@/utils/createRequest'
const request = createRequest('/admin')

// 获取所有菜单
export function getMenuList() {
  return request({
    url: `/sys/menu/tree`,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: `/sys/menu/save`,
    method: 'post',
    data
  })
}

// 编辑菜单
export function updateMenu(data) {
  return request({
    url: `/sys/menu/save`,
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/sys/menu/delete/${id}`,
    method: 'get'
  })
}
// 返回角色已分配的菜单ID集合
export function getMenuByRole(id) {
  return request({
    url: `/sys/menu/tree/${id}`,
    method: 'get'
  })
}
// 返回账号已分配的菜单ID集合
export function getMenuByAccount() {
  return request({
    url: `/sys/menu`,
    method: 'get'
  })
}

