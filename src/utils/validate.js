/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 端口号格式校验
export function isportnumber(value) {
  return /^([1-9]|[1-9]\\d{1,3}|[1-6][0-5][0-5][0-3][0-5])$/.test(value)
}

// ip格式校验
export function isIP(value) {
  return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
    value
  )
}

// 邮箱格式校验
export function isMaill(value) {
  return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
    value
  )
}

// 身份证格式校验
export function isID(value) {
  return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
    value
  )
}

// 电话格式校验
export function isPhone(value) {
  return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)
}

// 密码格式校验
export function isPassword(value) {
  return /^[a-zA-Z]\w{5,17}$/.test(value)
}

// 只能输入数字
export function isNumber(value) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(value)
}

// 英文格式校验
export function isEnglish(value) {
  return /^[a-zA-Z]+$/.test(value)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}
