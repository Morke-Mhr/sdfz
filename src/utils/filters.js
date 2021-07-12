import Vue from 'vue'
import store from '@/store/index.js'
// 过滤器
const filters = {
  educational(value) {
    //学制状态
    if (!value) return ''
    if (value == 1000001) {
      return '小学五年制'
    } else if (value == 1000002) {
      return '小学六年制'
    } else if (value == 1000003) {
      return '九年一贯（五四）制'
    } else if (value == 1000004) {
      return '九年一贯（六三）制'
    }
  },
  /**
   * mTable过滤器配置
   * @val 表格所传递过来的值
   * @attribute 值所对应的字段名
   * @atFilter item.atFilter传递过来的字段名 优先根据该项过滤 需写在其他过滤项前
   * @returns 处理后返回的数据通过return抛出
   */
  mtableFilfer(val, attribute, atFilter) {
    if (!val) return ''
    if (val == '0' && atFilter == 'logStatus') {
      return '正常'
    } else if (val == '1' && atFilter == 'logStatus') {
      return '异常'
    } else if (val == '0' && atFilter == 'facestate') {
      return '离线'
    } else if (val == '1' && atFilter == 'facestate') {
      return '在线'
    } else if (val == '0' && atFilter == 'roleStatus') {
      return '正常'
    } else if (val == '1' && atFilter == 'roleStatus') {
      return '停用'
    } else if (val == '0' && atFilter == 'taskLogStatus') {
      return '正常'
    } else if (val == '1' && atFilter == 'taskLogStatus') {
      return '失败'
    } else if (val == '0' && atFilter == 'noticeFlag') {
      return '显示'
    } else if (val == '1' && atFilter == 'noticeFlag') {
      return '隐藏'
    } else if (val == '1' && attribute == 'classStatus') {
      return '已毕业'
    } else if (val == '2' && attribute == 'classStatus') {
      return '正常'
    } else if (val == '0' && attribute == 'scope') {
      return '小学部'
    } else if (val == '1' && attribute == 'scope') {
      return '初中部'
    } else if (val == '2' && atFilter == 'scope') {
      return '全部'
    } else if (val == '1' && attribute == 'displayStatus') {
      return '显示'
    } else if (val == '2' && attribute == 'displayStatus') {
      return '隐藏'
    } else if (val == 0 && attribute == 'status') {
      return '正常'
    } else if (val == 1 && attribute == 'status') {
      return '冻结'
    } else if (val == 2 && attribute == 'status') {
      return '注销'
    } else if (val == 4 && attribute == 'status') {
      return '禁用'
    } else if (val == 0 && attribute == 'visible') {
      return '显示'
    } else if (val == 1 && attribute == 'visible') {
      return '隐藏'
    } else if (val == 'M' && attribute == 'menuType') {
      return '目录'
    } else if (val == 'C' && attribute == 'menuType') {
      return '菜单'
    } else if (val == 'F' && attribute == 'menuType') {
      return '按钮'
    } else if (val == 'Y' && attribute == 'configType') {
      return '是'
    } else if (val == 'N' && attribute == 'configType') {
      return '否'
    } else if (val == 'Y' && attribute == 'isDefault') {
      return '是'
    } else if (val == 'N' && attribute == 'isDefault') {
      return '否'
    } else if (val == '0' && attribute == 'businessType') {
      return '其它'
    } else if (val == '1' && attribute == 'businessType') {
      return '新增'
    } else if (val == '2' && attribute == 'businessType') {
      return '修改'
    } else if (val == '3' && attribute == 'businessType') {
      return '删除'
    }  else if (val == '0' && attribute == 'planType') {
      return '长期'
    } else if (val == '1' && attribute == 'planType') {
      return '临时'
    } else if (val == '2' && attribute == 'planType') {
      return '全部'
    }else if (val == '2' && attribute == 'currentStatus') {
      return '全部'
    }else if (val == '0' && attribute == 'currentStatus') {
      return '正常'
    } else if (val == '1' && attribute == 'currentStatus') {
      return '逾期'
    }  else {
      return val
    }
  },
  showImg(value) {
    return (
      store.state.apiConfiguration.url +
      store.state.serviceName.jurisdiction +
      value
    )
  },
  difficulty(value) {
    //task  难度单位
    if (value == 1) {
      return '简单'
    } else if (value == 2) {
      return '一般'
    } else if (value == 3) {
      return '较难'
    } else {
      return '很难'
    }
  },
  costTimeUnit(value) {
    //task  时长单位
    if (value == 0) {
      return '天'
    } else if (value == 1) {
      return '小时'
    } else if (value == 2) {
      return '月'
    }
  },
  //任务验收满意度
  degree(value) {
    if (value == 0) {
      return '非常满意'
    } else if (value == 1) {
      return '满意'
    } else if (value == 2) {
      return '一般'
    } else if (value == 3) {
      return '不满意'
    } else if (value == 4) {
      return '很不满意'
    }
  },
  //测验状态
  exam_topicState(value) {
    if (value == 0) {
      return '禁用'
    } else if (value == 1) {
      return '待提交'
    } else if (value == 2) {
      return '待审核'
    } else if (value == 3) {
      return '审核失败'
    } else if (value == 4) {
      return '审核成功'
    }
  },
  //奖惩记录 奖惩类型
  yearcompliance(value) {
    if (value == 0) {
      return '奖励'
    } else if (value == 1) {
      return '惩罚'
    }
  },
  //年度考核目标达标明细 达标
  year_compliance_detail(value) {
    if (value == 0) {
      return '合格'
    } else if (value == 1) {
      return '不合格'
    }
  }
}

Vue.prototype.$dateFormat = function(fmt, date) {
  if (!date) {
    date = new Date()
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export default filters
