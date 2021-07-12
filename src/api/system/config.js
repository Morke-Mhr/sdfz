import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 查询参数配置列表
export function getConfigList(params) {
  return request({
    url: jurisdiction + `/config/list`,
    method: 'get',
    params
  })
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: jurisdiction + '/config',
    method: 'post',
    data
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: jurisdiction + '/config',
    method: 'put',
    data
  })
}

// 删除参数配置
export function deleteConfig(configIds) {
  return request({
    url: jurisdiction + `/config/${configIds}`,
    method: 'delete'
  })
}

// 根据参数配置id获取详细信息
export function getConfigInfo(configIds) {
  return request({
    url: jurisdiction + `/config/${configIds}`,
    method: 'get'
  })
}
