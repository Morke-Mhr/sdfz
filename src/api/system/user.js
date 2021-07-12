import request from '@/utils/request'
import store from '@/store'

const jurisdiction = store.state.serviceName.jurisdiction

export function getInfo() {
  return request({
    url: jurisdiction + '/getInfo',
    method: 'get'
  })
}

export function getRouters() {
  return request({
    url: jurisdiction + `/getRouters/${0}`,
    method: 'get'
  })
}

/* 用户信息相关*/
// 新增用户
export function addUser(data) {
  return request({
    url: jurisdiction + '/user',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUse(data) {
  return request({
    url: jurisdiction + '/user',
    method: 'put',
    data
  })
}

// 用户重置密码
export function UserPwd(data) {
  return request({
    url: jurisdiction + '/user/resetPwd',
    method: 'put',
    data
  })
}

// 获取角色信息列表
export function getUserList(params) {
  return request({
    url: jurisdiction + `/user/list`,
    method: 'get',
    params
  })
}

// 删除用户
export function deleteUser(userIds) {
  return request({
    url: jurisdiction + `/user/${userIds}`,
    method: 'delete'
  })
}

// 用户信息管理-用户状态修改
export function changeStatus(data) {
  return request({
    url: jurisdiction + `/user/changeStatus`,
    method: 'put',
    data
  })
}

// 根据用户id获取详细信息
export function getUserInfo(userId) {
  return request({
    url: jurisdiction + `/user/${userId}`,
    method: 'get'
  })
}
