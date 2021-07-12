import request from '@/utils/request'
import axios from 'axios'
import store from '@/store'
const serviceName = store.state.serviceName.login

export function loginApi(data) {
  return request({
    url: serviceName + '/login',
    method: 'post',
    data
  })
}

export function getCode(params) {
  return request({
    url: serviceName + '/captchaImage',
    method: 'get',
    params
  })
}

//验证码接口
export function phoneSendsms(data) {
  return axios.post(
    store.state.apiConfiguration.url + serviceName + `/sendVerifycodeSms`,
    data
  )
}

//手机号码登录
export function phoneLogin(data) {
  return request({
    url: serviceName + '/phoneLogin',
    method: 'post',
    data
  })
}

//手机号码验证
export function queryPhone(data) {
  return axios.get(
    store.state.apiConfiguration.url +
      serviceName +
      `/user/queryByMobile?phonenumber=${data}`
  )
}

//修改密码
export function PwdPhone(data) {
  return axios.put(
    store.state.apiConfiguration.url +
      serviceName +
      `/user/profile/updatePwdByphonenumber`,
    data
  )
}

//验证找回密码短信验证码
export function checkPwdPhone(data) {
  return axios.post(
    store.state.apiConfiguration.url + serviceName + `/user/checkSmscode`,
    data
  )
}
