import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 查询字典数据列表
export function getDictDataList(params) {
  return request({
    url: jurisdiction + `/dict/data/list`,
    method: 'get',
    params
  })
}

// 新增字典数据
export function addDictData(data) {
  return request({
    url: jurisdiction + '/dict/data',
    method: 'post',
    data
  })
}

// 修改字典数据
export function updateDictData(data) {
  return request({
    url: jurisdiction + '/dict/data',
    method: 'put',
    data
  })
}

// 删除字典数据
export function deleteDictData(dictCodes) {
  return request({
    url: jurisdiction + `/dict/data/${dictCodes}`,
    method: 'delete'
  })
}

// 根据字典数据id获取详细信息
export function getDictDataInfo(dictCode) {
  return request({
    url: jurisdiction + `/dict/data/${dictCode}`,
    method: 'get'
  })
}
