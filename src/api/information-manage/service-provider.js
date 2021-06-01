import request from '@/utils/information-manage-request'

// 查询服务商
export function selectList(data) {
    return request({
        url: '/facilitator/selectList',
        method: 'POST',
        data
    })
}

export function getStatus() {
    return request({
        url: '/facilitator/status',
        method: 'POST'
    })
}