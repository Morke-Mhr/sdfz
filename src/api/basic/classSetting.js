import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 班级设置分页查询
export function gradeList(params) {
  return request({
    url: jurisdiction + `/class/list`,
    method: 'get',
    params
  })
}

// 班级新增
export function gradeAdd(data) {
  return request({
    url: jurisdiction + `/class`,
    method: 'POST',
    data
  })
}

// 班级删除
export function gradeDel(gradeIds) {
  return request({
    url: jurisdiction + `/class/${gradeIds}`,
    method: 'DELETE'
  })
}

// 班级修改
export function gradeFix(data) {
  return request({
    url: jurisdiction + `/class`,
    method: 'PUT',
    data
  })
}

// 详细信息查询
export function grade(sysngradeId) {
  return request({
    url: jurisdiction + `/class/${sysngradeId}`,
    method: 'get'
  })
}

// 详细信息查询
export function classOptionselect() {
  return request({
    url: jurisdiction + `/class/optionselect`,
    method: 'get'
  })
}

// 班级升级
export function classUpgrade(classId) {
  return request({
    url: jurisdiction + `/class/upgrade/${classId}`,
    method: 'PUT'
  })
}

// 一键升级
export function onekeyUpgrade(classId) {
  return request({
    url: jurisdiction + `/class/onekeyUpgrade/${classId}`,
    method: 'PUT'
  })
}
