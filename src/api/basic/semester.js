import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 学期管理--列表查询
export function semesterList(params) {
  return request({
    url: jurisdiction + `/semester/list`,
    method: 'get',
    params
  })
}

// 学期新增
export function semesterAdd(data) {
  return request({
    url: jurisdiction + `/semester`,
    method: 'POST',
    data
  })
}

// 学期删除
export function semesterDel(semesterIds) {
  return request({
    url: jurisdiction + `/semester/${semesterIds}`,
    method: 'DELETE'
  })
}

// 学期修改
export function semesterFix(data) {
  return request({
    url: jurisdiction + `/semester`,
    method: 'PUT',
    data
  })
}

// 详细信息查询
export function semester(sysnSemesterId) {
  return request({
    url: jurisdiction + `/semester/${sysnSemesterId}`,
    method: 'get'
  })
}

// 获取当前学期
export function currentSemester() {
  return request({
    url: jurisdiction + `/semester/querySemesterByNowTime`,
    method: 'get'
  })
}
