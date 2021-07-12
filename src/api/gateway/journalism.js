import request from '@/utils/request'
import store from '@/store'
const gateway = store.state.serviceName.gateway


// 智慧门户-新闻分页查询
export function getbusNotice(params) {
    return request({
        url: gateway + `/busNotice/listByPage`,
        method: 'get',
        params
    })
}

// 智慧门户-新闻新增
export function postbusNotice(data) {
  return request({
      url: gateway + `/busNotice/add`,
      method: 'post',
      data
  })
}
// 智慧门户-按id查询
export function getidbusNotice(id) {
  return request({
      url: gateway + `/busNotice/`+id,
      method: 'get',
  })
}

// 智慧门户-新闻修改
export function putbusNotice(data) {
  return request({
      url: gateway + `/busNotice/`,
      method: 'put',
      data
  })
}

// 智慧门户-新闻删除
export function delbusNotice(id) {
  return request({
      url: gateway + `/busNotice/`+id,
      method: 'delete',
  })
}



// 智慧门户-通知分页查询-我发出的
export function getlistByPage2(params) {
  return request({
      url: gateway + `/busNotice/listByPage2`,
      method: 'get',
      params
  })
}


  // 智慧门户-通知分页查询-我收到的
  export function getlistRcvByPage(params) {
    return request({
        url: gateway + `/busNotice/listRcvByPage`,
        method: 'get',
        params
    })
  }