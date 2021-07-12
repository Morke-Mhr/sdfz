import request from '@/utils/request'
import store from '@/store'

const jurisdiction = store.state.serviceName.jurisdiction

// 获取菜单列表
export function getMenuList(params) {
  return request({
    url: jurisdiction + `/menu/list`,
    method: 'get',
    params
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: jurisdiction + '/menu',
    method: 'post',
    data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: jurisdiction + '/menu',
    method: 'put',
    data
  })
}

// 获取菜单下拉树列表
export function getMenutreeSelect() {
  return request({
    url: jurisdiction + '/menu/treeselect',
    method: 'get'
  })
}

//获取菜单范围
export function getSelectmenuItem(dictType) {
  return request({
    url: jurisdiction + `/dict/data/dictType/${dictType}`,
    method: 'get'
  })
}

// 删除菜单
export function deleteMenu(menuId) {
  return request({
    url: jurisdiction + `/menu/${menuId}`,
    method: 'delete'
  })
}

// 根据菜单ID获取详细信息
export function getMenuInfo(menuId) {
  return request({
    url: jurisdiction + `/menu/${menuId}`,
    method: 'get'
  })
}
