import request from '@/utils/request'
import store from '@/store'
const gateway = store.state.serviceName.gateway

// 值班计划-查询值班计划数据列表
export function getPlans(params) {
  return request({
    url: gateway + `/dutyplans/list`,
    method: 'get',
    params
  })
}

// 值班计划-根据值班计划编号获取详细信息
export function getIdPlans(id) {
  return request({
    url: gateway + `/dutyplans/`+id,
    method: 'get',
  })
}


// 值班计划-新增值班计划
export function postPlans(data) {
  return request({
    url: gateway + `/dutyplans`,
    method: 'post',
    data
  })
}

// 值班计划-修改值班计划
export function putPlans(data) {
  return request({
    url: gateway + `/dutyplans`,
    method: 'put',
    data
  })
}
