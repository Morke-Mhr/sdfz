import request from '@/utils/request'
import store from '@/store'

const jurisdiction = store.state.serviceName.jurisdiction

// 部门管理-查询部门列表
export function getDeptlist(params) {
  return request({
    url: jurisdiction + `/dept/list`,
    method: 'get',
    params
  })
}

// 部门管理-查询部门下拉树列表
export function getDeptTreeselect(params) {
  return request({
    url: jurisdiction + `/dept/treeselect`,
    method: 'get',
    params
  })
}

//字典数据管理-根据字典类型查询字典数据信息
export function getSelectTechItem(dictType) {
  return request({
    url: jurisdiction + `/dict/data/dictType/${dictType}`,
    method: 'get'
  })
}

// 菜单下拉树列表
export function getMenutreeSelect() {
  return request({
    url: jurisdiction + '/menu/treeselect',
    method: 'get'
  })
}

// 角色菜单列表树
export function getRoleMenuTreeSelect(roleId) {
  return request({
    url: jurisdiction + `/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  })
}

// 部门下拉树列表
export function getTreeDeptSelect(params) {
  return request({
    url: jurisdiction + '/dept/treeselect',
    method: 'get',
    params: params ? params : ''
  })
}

// 岗位选择下拉列表
export function getPostOptionselect(params) {
  var url = jurisdiction + '/post/optionselect'
  if (params) {
    url = jurisdiction + `/post/optionselect/${params}`
  }
  return request({
    url,
    method: 'get'
  })
}

// 角色信息管理-查询角色选择框列表
export function getRolesOptionselect(params) {
  return request({
    url: jurisdiction + '/role/optionselect',
    method: 'get',
    params
  })
}

// 根据部门编号获取人员信息副本
export function getUserListByDeptId(deptId) {
  return request({
    url: jurisdiction + `/user/getUserListByDeptId?deptId=${deptId}`,
    method: 'get'
  })
}

// 根据登录人获取本部门所有人员集合
export function getUsersByLoginuser() {
  return request({
    url: jurisdiction + `/user/getUsersByLoginuser`,
    method: 'get'
  })
}

// 个人信息业务处理管理-修改主题
export function updateTheme(data) {
  return request({
    url: jurisdiction + `/user/profile/updateTheme`,
    method: 'put',
    data
  })
}

// 老师树结构
export function getqueryTeacherList() {
  return request({
    url: jurisdiction + `/scopeTree/queryTearcher`,
    method: 'get'
  })
}
// 家长树结构
export function getqueryStudentParent() {
  return request({
    url: jurisdiction + `/spTree/getStuParent`,
    method: 'get'
  })
}