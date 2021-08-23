import request from '@/utils/request'
// import { downloadServer } from '@/utils/request'

// 根据搜索条件，获取表格内容
// export function getSearchList(params, url) {
//   return request({
//     url: `/user/${url}/${params}`,
//     method: 'get'
//   })
// }
// 根据搜索条件，获取表格内容
export function getSearchList(data, url) {
  return request({
    url: `/governmentReport/${url}`,
    method: 'post',
    data
  })
}

// 下载表格
export function download(params, url) {
  return request({
    url: `/governmentReport/${url}`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 标签列表内容获取
export function getMarkersList() {
  return request({
    url: '/report/tag/page',
    method: 'get'
  }).then(res => {
    const markers = res.data
    const m = markers.filter(item => {
      return item.status === '0'
    })
    localStorage.setItem('markerList', JSON.stringify(m))
    return res
  })
}
// 标签增删相关接口
export function setMarkers(data, url) {
  return request({
    url: `/report/tag/${url}`,
    method: 'post',
    data
  })
}
// 下载文件
export function fileDownload(fileName) {
  return request({
    url: '/file/download',
    method: 'get',
    params: {
      fileName
    },
    responseType: 'blob'
  })
}
