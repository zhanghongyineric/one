/*
 * FileName: request.js
 * @author: ZhouJiaXing
 * @date: 2021/6/8 下午3:03
 */

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import fileDownload from 'js-file-download'

let messageBox = null // 存放弹窗实例，避免重复弹窗
let message = null // 存放提示实例，避免重复弹窗

export default function createRequest(baseUrl, wait_time) {
  // 创建axios实例
  const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API + (baseUrl || ''),
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: wait_time || 20000 // request timeout
  })

  // 请求拦截
  service.interceptors.request.use(
    config => {
      // 配置token
      if (store.getters.token) {
        config.headers['Authorization'] = `Bearer ${getToken()}`
      }
      return config
    },
    error => {
      // do something with request error
      console.log('ReqError/', error) // for debug
      return Promise.reject(error)
    }
  )

  // 响应拦截
  service.interceptors.response.use(
    response => {
      const res = response.data
      // 捕获文件流，直接下载
      if (res instanceof Blob) {
        if (response.headers['content-file'] === 'no') {
          Message({
            type: 'warning',
            message: '没有相关文件'
          })
          return
        }
        try {
          const contentDisposition = response.headers['content-disposition']
          if (contentDisposition) {
            const fileName = decodeURI(contentDisposition.slice(contentDisposition.indexOf('filename=') + 9)) // 获取文件名
            fileDownload(res, fileName) // 下载
          } else {
            fileDownload(res, '数据文件.xlsx')
          }
          return res
        } catch (e) {
          Message({
            type: 'error',
            message: '文件下载失败'
          })
          return 0
        }
      }
      // 捕获账号登录状态异常
      if (res.code === 401 || res.code === 403) {
        // 重新刷新页面（无用户信息）异常会被permission.js捕获，直接跳转到登陆页，此时无需弹窗
        if (store.getters.role) {
          // 没有弹窗实例再弹窗
          if (!messageBox) {
            messageBox = MessageBox.confirm('你已经被登出, 你可以点击取消留在这个界面, 或者重新登录', '确认登出?', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              messageBox = null
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            }).catch(e => {
              messageBox = null
            })
          }
        } else {
          if (!message) {
            message = Message({
              message: '身份过期，请重新登录',
              type: 'error',
              duration: 5 * 1000
            })
          } else {
            message = null
          }
        }
        return Promise.reject(new Error(res.msg || 'Error'))
      } else if (res.code !== 200) {
        // 非200表示操作出错，提示并返回错误结果
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        console.log('ResError', res)
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        // 200操作成功，返回结果
        return res
      }
    },
    error => {
      console.log('request_error/' + error) // for debug

      let message = error.message || '请求出错'

      if (message.includes('timeout')) {
        message = '请求超时'
      } else if (message.includes('Network Error')) {
        message = '网络请求错误'
      } else if (message.includes('400')) {
        message = '请求参数不正确'
      } else if (message.includes('404')) {
        message = '请求路径不存在'
      } else if (message.includes('405')) {
        message = '请求方法不正确'
      } else if (message.includes('500')) {
        message = '服务器内部错误'
      }

      Message({
        message,
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(error)
    }
  )

  return service
}
