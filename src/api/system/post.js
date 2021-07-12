import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 查询岗位列表
export function getPostList(params) {
  return request({
    url: jurisdiction + `/post/list`,
    method: 'get',
    params
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: jurisdiction + '/post',
    method: 'post',
    data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: jurisdiction + '/post',
    method: 'put',
    data
  })
}

// 删除岗位
export function deletePost(postIds) {
  return request({
    url: jurisdiction + `/post/${postIds}`,
    method: 'delete'
  })
}

// 根据岗位id获取详细信息
export function getPostInfo(postIds) {
  return request({
    url: jurisdiction + `/post/${postIds}`,
    method: 'get'
  })
}

// 用户信息管理-用户状态修改
export function changeStatus(data) {
  return request({
    url: jurisdiction + `/post/changeStatus`,
    method: 'put',
    data
  })
}
