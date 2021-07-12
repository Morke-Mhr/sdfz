import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 查询部门列表
export function getDeptList(params) {
  return request({
    url: jurisdiction + `/dept/list`,
    method: 'get',
    params
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: jurisdiction + '/dept',
    method: 'post',
    data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: jurisdiction + '/dept',
    method: 'put',
    data
  })
}
// 删除部门
export function deleteDept(deptId) {
  return request({
    url: jurisdiction + `/dept/${deptId}`,
    method: 'delete'
  })
}

// 根据部门ID获取详细信息
export function getDeptInfo(deptId) {
  return request({
    url: jurisdiction + `/dept/${deptId}`,
    method: 'get'
  })
}

export function optionSelect(params) {
  return request({
    url: jurisdiction + `/user/optionselect`,
    method: 'get',
    params
  })
}
