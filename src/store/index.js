import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import apiConfiguration from './apiConfiguration.js'
import approvalProcess from './modules/approvalProcess'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    showSdialog() {
      this._vm.$refs.sdialog.isShow = true
      this._vm.$refs.sdialog.treedata = []
    }
  },
  state: {
    serviceName: {
      //登录
      login: 'wth-sdfz-system-service',
      //系统模块
      jurisdiction: 'wth-sdfz-system-service',
      //智慧门户
      gateway: 'yiyi-sdfz-workbench-service',
      // 定时任务
      job: 'wth-sdfz-job-service',
      //听评课
      listenClass: 'yiyi-sdfz-workbench-service'
    },
    // 打包配置
    // serviceName: {
    //   //登录
    //   login: 'zd-system-service',
    //   //系统模块
    //   jurisdiction: 'zd-system-service',
    //   //智慧门户
    //   gateway: 'zd-workbench-service',
    //   // 定时任务
    //   job: 'zd-workbench-service',
    //   //听评课
    //   listenClass: 'zd-workbench-service'
    // },
    gateway: {
      $process: ':8001',
      // ljk
      $safetyEdu: ':8007',
      $mock: ':8080/app/mock/17',
      $addWorkMock: ':8080/app/mock/20',
      $safetyEduMock: ':8007/app/mock/17',
      $orgMock: ':8080/app/mock/17',
      $technology: ':8009',
      //岗位变更新增指导书列表
      $addBook: ':8017'
    },
    apiConfiguration,
    // 合并的路由对象
    routers_: {},
    pathHeader: '',
    approvalProcess,
    // 右侧tab所选项
    tabActive: '',
    //是否显示进度条
    showProgress: false,
    //是否显示错误页
    showError: false,
    // 错误页显示
    errorRes: null,
    // 抽屉显示
    drawerShow: false,
    // 民族列表
    nationList: [
      { id: 1, name: '汉族' },
      { id: 2, name: '蒙古族' },
      { id: 3, name: '回族' },
      { id: 4, name: '藏族' },
      { id: 5, name: '维吾尔族' },
      { id: 6, name: '苗族' },
      { id: 7, name: '彝族' },
      { id: 8, name: '壮族' },
      { id: 9, name: '布依族' },
      { id: 10, name: '朝鲜族' },
      { id: 11, name: '满族' },
      { id: 12, name: '侗族' },
      { id: 13, name: '瑶族' },
      { id: 14, name: '白族' },
      { id: 15, name: '土家族' },
      { id: 16, name: '哈尼族' },
      { id: 17, name: '哈萨克族' },
      { id: 18, name: '傣族' },
      { id: 19, name: '黎族' },
      { id: 20, name: '傈僳族' },
      { id: 21, name: '佤族' },
      { id: 22, name: '畲族' },
      { id: 23, name: '高山族' },
      { id: 24, name: '拉祜族' },
      { id: 25, name: '水族' },
      { id: 26, name: '东乡族' },
      { id: 27, name: '纳西族' },
      { id: 28, name: '景颇族' },
      { id: 29, name: '柯尔克孜族' },
      { id: 30, name: '土族' },
      { id: 31, name: '达翰尔族' },
      { id: 32, name: '么佬族' },
      { id: 33, name: '羌族' },
      { id: 34, name: '布朗族' },
      { id: 35, name: '撒拉族' },
      { id: 36, name: '毛南族' },
      { id: 37, name: '仡佬族' },
      { id: 38, name: '锡伯族' },
      { id: 39, name: '阿昌族' },
      { id: 40, name: '普米族' },
      { id: 41, name: '塔吉克族' },
      { id: 42, name: '怒族' },
      { id: 43, name: '乌孜别克族' },
      { id: 44, name: '俄罗斯族' },
      { id: 45, name: '鄂温克族' },
      { id: 46, name: '德昂族' },
      { id: 47, name: '保安族' },
      { id: 48, name: '裕固族' },
      { id: 49, name: '京族' },
      { id: 50, name: '塔塔尔族' },
      { id: 51, name: '独龙族' },
      { id: 52, name: '鄂伦春族' },
      { id: 53, name: '赫哲族' },
      { id: 54, name: '门巴族' },
      { id: 55, name: '珞巴族' },
      { id: 56, name: '基诺族' }
    ]
  },
  getters,
  mutations: {}
})

export default store
