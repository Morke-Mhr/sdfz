import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 获取角色列表
export function getRoles(params) {
  return request({
    url: jurisdiction + `/role/list`,
    method: 'get',
    params
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: jurisdiction + '/role',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: jurisdiction + '/role',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(roleIds) {
  return request({
    url: jurisdiction + `/role/${roleIds}`,
    method: 'delete'
  })
}

// 根据角色id获取详细信息
export function getRoleInfo(roleIds) {
  return request({
    url: jurisdiction + `/role/${roleIds}`,
    method: 'get'
  })
}

// 角色信息管理-修改保存数据权限
export function dataScope(data) {
  return request({
    url: jurisdiction + '/role/dataScope',
    method: 'put',
    data
  })
}
