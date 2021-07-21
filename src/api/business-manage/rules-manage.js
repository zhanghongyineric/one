import createRequest from '@/utils/createRequest'
const request = createRequest('/baseInfo/rule')

// 查询所有违章规则
export function selectList(data) {
  return request({
    url: '/violation/selectList',
    method: 'POST',
    data
  })
}

// 违章规则的增加与修改
export function save(data) {
  return request({
    url: '/violation/save',
    method: 'POST',
    data
  })
}

// 违章规则的删除
export function deleteData(data) {
  return request({
    url: '/violation/delete',
    method: 'POST',
    data
  })
}

// 查询违章规则程度
export function violationDegree(data) {
  return request({
    url: '/violation/violationDegree',
    method: 'POST',
    data
  })
}

// 违章类型
export function violationType(data) {
  return request({
    url: '/violation/violationType',
    method: 'POST',
    data
  })
}

// 计算符号
export function symbol(data) {
  return request({
    url: '/violation/symbol',
    method: 'POST',
    data
  })
}

// 违章条件
export function condition(data) {
  return request({
    url: '/violation/condition',
    method: 'POST',
    data
  })
}

// 查询严重程度编辑
export function selectEdit(data) {
  return request({
    url: '/violation/selectEdit',
    method: 'POST',
    data
  })
}

// 新增 违章程度
export function insertViolationDegree(data) {
  return request({
    url: '/violation/insertViolationDegree',
    method: 'POST',
    data
  })
}

// 删除违章程度
export function deleteViolationDegreeValue(data) {
  return request({
    url: '/violation/deleteViolationDegreeValue',
    method: 'POST',
    data
  })
}
