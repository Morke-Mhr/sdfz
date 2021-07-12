import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

//部门岗位树查询
export function getTreeSelect() {
  return request({
    url: serviceName + `/person/treeselect`,
    method: 'get'
  })
}
//基于树的用户查询
export function getPersonList(params) {
  return request({
    url: serviceName + `/person/list`,
    method: 'get',
    params
  })
}
//班级树
export function getTreeClass() {
  return request({
    url: serviceName + `/person/treeclass`,
    method: 'get'
  })
}
//根据树查询学生
export function getStudentList(params) {
  return request({
    url: serviceName + `/student/listByPage`,
    method: 'get',
    params
  })
}
//根据树查询家长
export function getParentList(params) {
  return request({
    url: serviceName + `/person/parentlist/`,
    method: 'get',
    params
  })
}
//家长查看
export function getStudentParentList(params) {
  return request({
    url: serviceName + `/student/parentList/${params}`,
    method: 'get'
  })
}
//学生查看
export function getStudentListByParentId(params) {
  return request({
    url: serviceName + `/student/studentListByParentId/${params}`,
    method: 'get'
  })
}
//班级的接口
export function getqueryAll(params) {
  return request({
    url: serviceName + `/class/queryAll`,
    method: 'get',
    params
  })
}
//老师信息修改
export function getTeacher(data) {
  return request({
    url: serviceName + `/teacher/updateTeacherUser`,
    method: 'POST',
    data
  })
}
//老师信息修改详情
export function getUser(userId) {
  return request({
    url: serviceName + `/teacher/getInfoByUserId/${userId}`,
    method: 'GET'
  })
}
