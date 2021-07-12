import axios from 'axios'
import JSONbig from 'json-bigint'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, setToken } from '@/utils/auth'
import apiConfiguration from '../store/apiConfiguration.js'

// const current = store.state.apiConfiguration[store.state.now]
// axios.headers['Authorization'] = getToken()
const service = axios.create({
  baseURL: '', // url = base url + request url
  timeout: 20000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformResponse: [
    function(data) {
      // 对 data 进行任意转换处理
      return JSONbig.parse(data)
    }
  ]
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    if (config.method != 'get') {
      store.state.showProgress = true
    }
    const gateway = store.state.gateway
    let url = config.url
    let boo = false
    const arrList = Object.keys(gateway)
    for (let i = 0; i < arrList.length; i++) {
      const value = arrList[i]
      if (url.indexOf(value) >= 0) {
        const itme = gateway[value + '']
        url = url.replace(value, itme)
        boo = true
        break
      }
    }
    if (boo) {
      let baseURL = apiConfiguration.url

      baseURL = baseURL.substring(0, baseURL.lastIndexOf(':'))
      config.url = baseURL + url
    } else {
      config.url = apiConfiguration.url + url
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data

    const token = response.headers['authorization']
    // debugger
    //  console.log(response.headers,response.headers['authorization'],'token')
    if (token) {
      setToken(token)
    }
    if (res.code != 200) {
      // 如果code不是200及请求失败 获取message值 关闭进度条 显示错误页
      let message = res.message
      setTimeout(() => {
        store.state.showProgress = false
        store.state.errorRes = res
        store.state.showError = true
      }, 500)
      if (res.body) {
        if (typeof res.body == 'string') {
          message = res.body
        }
      }
      if (message == 'TOKEN已过期') {
        Message({
          message: '您的会话状态已失效，请重新登录' || 'Error',
          type: 'error',
          duration: 2 * 1000
        })
      }
      // message错误提示
      // else {
      //   Message({
      //     message: message || 'Error',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // }
      // 控制台错误提示
      // console.error('接口异常：' + response.config.url)
      // console.error('异常信息：' + message)
      // console.error('错误码为：' + res.code)
      if (res.code == 508 || res.code == 512 || res.code == 514) {
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.code == 10000006) {
        // TOKEN已过期
        store.dispatch('user/logout').then(() => {
          router.push(`/login?redirect=${router.fullPath}`)
        })
      }
      // 抛出错误
      return Promise.reject(new Error(message || 'Error'))
    } else {
      // 成功后关闭进度条
      if (store.state.showProgress) {
        setTimeout(() => {
          store.state.showProgress = false
          if (response.config.method != 'get') {
            Message({
              message: res.message,
              type: 'success',
              duration: 2 * 1000
            })
          }
          return false
        }, 500)
      }
      return res.body || res
    }
  },
  (error) => {
    Message({
      message: '服务器开小差啦，请稍后再试～',
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
