import request from '@/utils/request'
import store from '@/store'
const gateway = store.state.serviceName.gateway

// 轮播图-分页查询
export function getbusCarousel(params) {
  return request({
    url: gateway + `/busCarousel/listByPage`,
    method: 'get',
    params
  })
}

// 轮播图-新增
export function postbusCarousel(data) {
  return request({
    url: gateway + `/busCarousel/add`,
    method: 'post',
    data
  })
}


// 轮播图-修改
export function putbusCarousel(data) {
  return request({
    url: gateway + `/busCarousel/`,
    method: 'put',
    data
  })
}

// 轮播图-删除
export function delbusCarousel(Id) {
  return request({
    url: gateway + `/busCarousel/`+Id,
    method: 'delete',
    
  })
}


// 轮播图-id查询
export function getiIbusCarousel(Id) {
  return request({
    url: gateway + `/busCarousel/`+Id,
    method: 'get',
  })
}