import Vue from 'vue'
import store from '@/store/index.js'

// 权限指令
const has = Vue.directive('has', {
  bind: function() {
    // 指令绑定到元素时触发
  },
  inserted: function(el, binding) {
    // 指令插入到元素时触发
    const value = binding.value
    // 检查是否指定权限范围
    // console.log(binding,'权限范围')
    if (value) {
      const jurisdiction = binding.value
      // 检查权限
      if (
        store.state.user.user.admin ||
        store.state.user.permissions[0] === '*:*:*'
      ) {
        return
      }
      //
      if (!Vue.prototype.$_has(jurisdiction)) {
        el.parentNode.removeChild(el)
      }
    } else {
      console.error('没有设置权限范围')
    }
  }
})
// 权限检查方法
Vue.prototype.$_has = function(value) {
  let isExist = false
  // 获取用户权限
  const userPermissions = store.state.user.permissions
  // 如果不存在直接false
  if (userPermissions === undefined || userPermissions === null) {
    return false
  }
  // 当返回true时将结束后面的循环
  isExist = userPermissions.some(function(role) {
    // const res = role.indexOf(value) > -1
    return role === value
  })
  return isExist
}
export { has }
