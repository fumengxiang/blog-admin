import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

import { PcCookie, Key } from '@/utils/cookie';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})


// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const accessToken = PcCookie.get(Key.accessTokenKey)
    if (accessToken) {
      // oauth2
      // 请求头中，key值为Authorization，value为 Bearer ${accessToken}
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
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
  // 成功响应
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      // 在页面请求中已经判断过状态码，所以此时不需要在判断
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  // 响应出错
  error => {
    // 非401状态码，则直接提示信息
    if (error.response && error.response.status !== 401) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }

    // 401 未认证，刷新令牌获取新的认证信息
    let isLook = true // 防止重复发送刷新请求
    if (isLook && PcCookie.get(Key.refreshTokenKey)) {
      isLook = false
      // 跳转到认证中心，实现刷新令牌
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/refresh?redirectURL=${window.location.href}`
    } else {
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/?redirectURL=${window.location.href}`
    }

    return Promise.reject('令牌过期，重新认证')
  }
)

export default service
