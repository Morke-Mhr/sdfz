import request from '@/utils/request'
import store from '@/store'
const listenClass = store.state.serviceName.listenClass

// 评价方案--分页查询
export function listByPage(params) {
  return request({
    url: listenClass + `/busScheme/listByPage`,
    method: 'get',
    params
  })
}

// 评价方案-增加
export function busSchemeAdd(data) {
  return request({
    url: listenClass + `/busScheme/add`,
    method: 'post',
    data
  })
}

// 评价方案-修改
export function busSchemeFix(data) {
  return request({
    url: listenClass + `/busScheme`,
    method: 'put',
    data
  })
}

// 评价方案-增加
export function bySchemeId(schemeId) {
  return request({
    url: listenClass + `/busScheme/${schemeId}`,
    method: 'get'
  })
}
