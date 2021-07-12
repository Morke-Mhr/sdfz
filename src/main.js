import Vue from 'vue'
// 导入的css
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/theme.scss' // global css
import '@/assets/icon/iconfont.css'
import 'bpmn-js/dist/assets/diagram-js.css' //bpmn-js
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'


import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

// 导入element、vue相关
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import '@/permission' // permission control
// 按钮级权限校验（没做页面深层嵌套时校验）
import has from './directive/jurisdiction.js'
console.log(has, 'has')
// 打印
import Print from 'vue-print-nb'
Vue.use(Print)
//导入公共方法
import uComment from '@/utils/comment'
Vue.use(uComment)
// 导入全局过滤器
import filters from '@/utils/filters.js'
for (let key in filters) {
  Vue.filter(key, filters[key])
}
// 导入全局组件 并注册
import vueComs from './components/index'
vueComs()
//自定义表单组件
import EleForm from 'vue-ele-form'
import FRender from 'f-render'
import EleFormQuillEditor from 'vue-ele-form-quill-editor'
Vue.use(EleForm)
Vue.component('f-render', FRender)
Vue.component('quill-editor', EleFormQuillEditor)
// 导入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
//视频播放依赖
import 'video.js/dist/video-js.css'

if (process.env.NODE_ENV === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
