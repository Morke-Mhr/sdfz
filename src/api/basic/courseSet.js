import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 学期管理--列表查询
export function curriculumList(params) {
  return request({
    url: jurisdiction + `/curriculum/list`,
    method: 'get',
    params
  })
}

// 学期新增
export function curriculumAdd(data) {
  return request({
    url: jurisdiction + `/curriculum`,
    method: 'POST',
    data
  })
}

// 学期删除
export function curriculumDel(curriculumIds) {
  return request({
    url: jurisdiction + `/curriculum/${curriculumIds}`,
    method: 'DELETE'
  })
}

// 学期修改
export function curriculumFix(data) {
  return request({
    url: jurisdiction + `/curriculum`,
    method: 'PUT',
    data
  })
}

// 详细信息查询
export function curriculum(sysncurriculumId) {
  return request({
    url: jurisdiction + `/curriculum/${sysncurriculumId}`,
    method: 'get'
  })
}

// 下拉选择
export function curriculumSelect() {
  return request({
    url: jurisdiction + `/curriculum/optionselect`,
    method: 'GET'
  })
}
