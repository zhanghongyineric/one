import request from '@/utils/information-manage-request'

// 获取查询条件
export function queryConditions() {
    return request({
        url: '/platformInfo/queryConditions',
        method: 'POST',
    })
}

// 协议版本
export function protocolVersion() {
    return request({
        url: '/platformInfo/protocolVersion',
        method: 'POST',
    })
}

// 查询接入平台信息
export function selectList(data) {
    return request({
        url: '/platformInfo/selectList',
        method: 'POST',
        data
    })
}

// 增加接入平台信息
export function save(data) {
    return request({
        url: '/platformInfo/save',
        method: 'POST',
        data
    })
}

// 删除接入平台信息
export function deleteData(data) {
    return request({
        url: '/platformInfo/delete',
        method: 'POST',
        data
    })
}

// 是否可链接
export function allowConnect(data) {
    return request({
        url: '/platformInfo/allowConnect',
        method: 'POST',
        data
    })
}

// 输入关键字返回服务商名称
export function facilitatorName(data) {
    return request({
        url: '/platformInfo/facilitatorName',
        method: 'POST',
        data
    })
}