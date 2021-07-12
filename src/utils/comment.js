export default {
  install(Vue) {
    // 暂时弃用
    Vue.prototype.closeProgress = function(val) {
      if (val) {
        setTimeout(() => {
          this.$store.state.showProgress = false
          return false
        }, 500)
      } else {
        this.$store.state.showProgress = false
        return false
      }
      console.log('关闭进度条', val)
    }
    Vue.prototype.openProgress = function(val) {
      this.$store.state.showProgress = true
      console.log('打开进度条', val)
    }
  }
}
