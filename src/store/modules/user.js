import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Layout from '@/layout'
import request from '@/utils/request'
import store from '@/store'

const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}
// 动态导入
function filterAsyncRouter(asyncRouterMap) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        // Layout组件特殊处理
        route.path = '/' + route.path
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.name) {
      route.name = route.name.toLowerCase()
    }

    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

const getDefaultState = () => {
  return {
    token: getToken(),
    user: {},
    permissions: [],
    userRoles: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_REMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ROLES: (state, roles) => {
    state.userRoles = roles
  }
}

const actions = {
  // 刷新页面重新取得用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      import('@/api/system/user')
        .then(({ getInfo }) => {
          getInfo()
            .then((response) => {
              //  console.log(" getInfo response:", response)
              commit('SET_USER', response.user)
              commit('SET_REMISSIONS', response.permissions)
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((err) => {
          console(err.message)
        })
    })
  },
  // 获取路由表
  getRouters({ commit }) {
    return new Promise((resolve, reject) => {
      import('@/api/system/user')
        .then(({ getRouters }) => {
          getRouters()
            .then((response) => {
              const accessedRouters = filterAsyncRouter(response)
              commit('SET_ROLES', accessedRouters)
              resolve(accessedRouters)
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((err) => {
          console(err.message)
        })
    })
  },

  // user logout
  logout({ commit }) {
    request({
      url: store.state.serviceName.jurisdiction + `/logout`,
      method: 'post'
    })
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
  },
  logoin({ commit }, userInfo) {
    if (userInfo.phonenumber != undefined) {
      return new Promise((resolve, reject) => {
        import('@/api/login/login')
          .then(({ phoneLogin }) => {
            phoneLogin(userInfo)
              .then(function(res) {
                setToken(res.token)
                commit('SET_TOKEN', res.token)
                resolve()
              })
              .catch((error) => {
                reject(error)
              })
          })
          .catch((err) => {
            console(err.message)
          })
      })
    }
    if (userInfo.username != undefined) {
      return new Promise((resolve, reject) => {
        import('@/api/login/login')
          .then(({ loginApi }) => {
            loginApi(userInfo)
              .then(function(res) {
                setToken(res.token)
                commit('SET_TOKEN', res.token)
                resolve()
              })
              .catch((error) => {
                reject(error)
              })
          })
          .catch((err) => {
            console(err.message)
          })
      })
    }
  },
  // remove token
  resetToken({ commit }) {
    console.log('执行删除token')
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 开启了命名空间，访问时需要加上命名空间
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
