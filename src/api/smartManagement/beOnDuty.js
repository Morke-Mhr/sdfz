import request from '@/utils/request'
import store from '@/store'
const gateway = store.state.serviceName.gateway

// 值班指标-查询值班指标数据列表
export function getquota(params) {
  return request({
    url: gateway + `/quota/list`,
    method: 'get',
    params
  })
}

// 值班指标-根据值班指标编号获取详细信息
export function getIdquota(ID) {
  return request({
    url: gateway + `/quota/id/`+ID,
    method: 'get',
  })
}


// 值班指标-新增值班指标
export function postquota(data) {
  return request({
    url: gateway + `/quota`,
    method: 'post',
    data
  })
}

// 值班指标-修改值班指标
export function putquota(data) {
  return request({
    url: gateway + `/quota`,
    method: 'put',
    data
  })
}

export function scopeAll(scope){
  return request({
    url: gateway + `/quota/scope/`+scope,
    method: 'get',
    scope
  })
  
}
