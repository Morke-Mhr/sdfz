import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 查询字典类型列表
export function getDictTypeList(params) {
  return request({
    url: serviceName + `/dict/type/list`,
    method: 'get',
    params
  })
}

// 新增字典类型
export function addDictType(data) {
  return request({
    url: serviceName + '/dict/type',
    method: 'post',
    data
  })
}

// 修改字典类型
export function updateDictType(data) {
  return request({
    url: serviceName + '/dict/type',
    method: 'put',
    data
  })
}

// 删除字典类型
export function deleteDictType(dictIds) {
  return request({
    url: serviceName + `/dict/type/${dictIds}`,
    method: 'delete'
  })
}

// 根据字典类型id获取详细信息
export function getDictTypeInfo(dictId) {
  return request({
    url: serviceName + `/dict/type/${dictId}`,
    method: 'get'
  })
}

// 字典数据修改记录管理-查询字典修改记录
export function dictChange(params) {
  return request({
    url: serviceName + `/dictChange/list`,
    method: 'get',
    params
  })
}

// 字典使用记录管理-查询字典使用记录列表
export function dictUseHist(params) {
  return request({
    url: serviceName + `/dictUseHist/list`,
    method: 'get',
    params
  })
}
