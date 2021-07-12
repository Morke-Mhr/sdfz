// 定义全局变量
const approvalProcess = {
  //使用方法this.$store.state.approvalProcess.postchange
  /**
   * 直接发起
   */
  //岗位变更
  postchange: 'postchange',
  //培训计划
  trainplan: 'trainplan',
  //安全经费计提计划
  safefundplan: 'safefundplan',
  //安全经费计提
  safefundget: 'safefundget',
  //事故上报
  accident: 'accident',
  //隐患整改延期申请
  hiddendangerdeplaydate: 'hiddendangerdeplaydate',
  //隐患整改变更实施人
  hiddendangerimplementer: 'hiddendangerimplementer',
  //隐患整改增加协助人
  hiddendangerhelper: 'hiddendangerhelper',

  /**
   * 选择审批流再发起
   */
  //安全责任书
  safebook: 'safebook',
  //安全检查
  safecheck: 'safecheck',
  //应急预案
  emergencyplan: 'emergencyplan',
  //隐患分配
  hiddendangerdown: 'hiddendangerdown',
  //隐患验收
  hiddendangercheck: 'hiddendangercheck',
  //施工方案
  program: 'program'
}

export default approvalProcess
