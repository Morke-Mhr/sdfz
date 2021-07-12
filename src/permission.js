import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false,
  speed:2000
}) // NProgress Configuration

// const _import = require('./router/_import_' + process.env.NODE_ENV)// 获取组件的方法

const whiteList = ['/login'] // no redirect whitelist

// 全局前置路由守卫，在跳转路由前做判断
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      console.log(88888)
      // next({
      //   path: '/'
      // })
      try {
        //获取用户信息,并将路由信息返回
        await store.dispatch('user/getInfo')
        store.dispatch('user/getRouters').then(async function(res) {
          console.log(res)
          router.addRoutes(res)
          next({
            path: res[0].path + '/' + res[0].children[0].path
          })
          // router.addRoutes(res)
          //
          // next({ ...to,
          //   replace: true
          // })
        })
      } catch (error) {
        // 如果出错，删除token并跳转到登录页面
        // console.error(error.message || 'Has Error')
        // await store.dispatch('user/resetToken')
        // next(`/login?redirect=${to.path}`)
        // NProgress.done()
      }
      NProgress.done()
    } else {
      // 如果取得用户路由信息继续向前，否则添加路由游信息
      const hasRoles = store.getters.userRoles
      // && store.getters.userRoles.length > 0
      if (hasRoles) {
        next()
      } else {
        // next()
        // //next({ ...to, replace: true })
        try {
          //获取用户信息,并将路由信息返回
          await store.dispatch('user/getInfo')
          store.dispatch('user/getRouters').then(async function(res) {
            // console.log(res);
            router.addRoutes(res)
            //
            // console.log(to)
            next({ ...to, replace: true })
          })
        } catch (error) {
          // 如果出错，删除token并跳转到登录页面
          console.error(error.message || 'Has Error')
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
