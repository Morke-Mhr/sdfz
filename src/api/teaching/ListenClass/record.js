import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'
const listenClass = store.state.serviceName.listenClass

// 听评课管理--列表查询
export function busListenClassList(params) {
  return request({
    url: listenClass + `/busListenClass/listByPage`,
    method: 'get',
    params
  })
}

// 听评课-根据id获取信息（查看详情）
export function busListenClass(listenClassId) {
  return request({
    url: listenClass + `/busListenClass/${listenClassId}`,
    method: 'get'
  })
}

// 获取教师列表
export function queryTeacherList() {
  return request({
    url: listenClass + `/busListenClass/queryTeacherList`,
    method: 'get'
  })
}

// 听评课-获取学期列表
export function querySemesterList() {
  return request({
    url: listenClass + `/busListenClass/querySemesterList`,
    method: 'get'
  })
}

// 获取听评课类型列表
export function queryClassTypeList() {
  return request({
    url: listenClass + `/busListenClassType/queryAll`,
    method: 'get'
  })
}

// 获取学科列表
export function querySubjectList() {
  return request({
    url: listenClass + `/busListenClass/querySubjectList`,
    method: 'get'
  })
}

// 获取班级列表
export function queryClassList() {
  return request({
    url: listenClass + `/busListenClass/queryClassList`,
    method: 'get'
  })
}

// 获取评价列表
export function queryBusScheme() {
  return request({
    url: listenClass + `/busScheme/queryAll`,
    method: 'get'
  })
}

// 听评课-增加
export function busListenClassAdd(data) {
  return request({
    url: listenClass + `/busListenClass/add`,
    method: 'POST',
    data
  })
}

// 听评课-删除
export function busListenClassDel(listenClassId) {
  return request({
    url: listenClass + `/busListenClass/${listenClassId}`,
    method: 'DELETE'
  })
}

// 听评课-修改
export function busListenClassFix(data) {
  return request({
    url: listenClass + `/busListenClass`,
    method: 'put',
    data
  })
}

// 听评课-zip附件打包下载
export function zipDownload(data) {
  return axios({
    url:
      store.state.apiConfiguration.url +
      listenClass +
      `/busListenClass/zipDownload`,
    data: data ? data : '',
    responseType: 'blob',
    headers: {
      Authorization: getToken()
    },
    method: 'post'
  })
    .then(function(res) {
      const { data, headers } = res
      const fileName = headers['content-disposition'].replace(
        /\w+;filename=(.*)/,
        '$1'
      )
      const blob = new Blob([data], {
        type: headers['content-type']
      })
      const dom = document.createElement('a') // 创建a标签
      const url = window.URL.createObjectURL(blob) // 创建下载的链接
      dom.href = url
      dom.download = decodeURI(fileName) // 下载后文件名
      document.body.appendChild(dom)
      dom.click() // 点击下载
      document.body.removeChild(dom) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    })
    .catch((err) => {
      console.log(err)
    })
}

// 听评课-反思
export function reThink(data) {
  return request({
    url: listenClass + `/busListenClass/reThink`,
    method: 'POST',
    data
  })
}
