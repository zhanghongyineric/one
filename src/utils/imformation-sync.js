import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

let messageBox = null // 存放弹窗实例，避免重复弹窗

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_INFORMATION_SYNC, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 配置token
    if (store.getters.token) {
      // 登录时产生的验证有问题，并且重新登录也不会改变，所以暂时这里写死
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

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 捕获账号登录状态异常
    if (res.code === 401 || res.code === 403) {
      // 重新刷新页面（无用户信息）异常会被permission.js捕获，直接跳转到登陆页，此时无需弹窗
      if (store.getters.name) {
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
        Message({
          message: res.msg || '身份过期，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
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

export default service
