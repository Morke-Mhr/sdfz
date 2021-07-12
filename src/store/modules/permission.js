import { asyncRouterMap, constantRouterMap } from '../../router/index.js'

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(function(role) {
      const userRoute = route.meta.role.join(',')
      const res = role.indexOf(userRoute) >= 0
      return res
    })
  } else {
    return true
  }
}
// 无限级路由递归
function routeRecursion(roles, v) {
  if (hasPermission(roles, v)) {
    if (v.children && v.children.length > 0) {
      v.children = v.children.filter((child) => {
        return routeRecursion(roles, child)
      })
      return v
    } else {
      return v
    }
  } else {
    return false
  }
}

const permission = {
  namespaced: true,
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    generateRoutes({ commit }, data) {
      return new Promise((resolve) => {
        const roles = data
        const accessedRouters = asyncRouterMap.filter((v) => {
          // 如果该用户含有system权限，那么该模块通过
          // if (roles.indexOf('system') >= 0) return true
          // 如果没有system权限则校验，校验规则自定义
          /*
          "system:role:list",
          "system:user:import",
          "system:user:edit",
          "system:user:query",
          "system:role:edit",
          "monitor:online:batchLogout",
          数据格式为
          父模块:子模块:按钮
          最后一个为按钮级别
          */
          /*
          没有设置路由权限的将通过路由校验
         */
          return routeRecursion(roles, v)
        })
        debugger
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
