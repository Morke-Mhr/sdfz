import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'
const gateway = store.state.serviceName.gateway

// 值班记录-查询值班记录数据列表
export function getRecord(params) {
  return request({
    url: gateway + `/dutyplansRecord/list`,
    method: 'get',
    params
  })
}

// 值班记录-根据值班记录编号获取详细信息
export function getIdRecord(id) {
  return request({
    url: gateway + `/dutyplansRecord/`+id,
    method: 'get',
  })
}


// 值班记录-根据id删除值班记录
export function removeRecord(id) {
  return request({
    url: gateway + `/dutyplansRecord/remove/`+id,
    method: 'delete',
  })
}

// 值班记录-下载值班记录报告
export function exportRecord(data) {
  return axios({
    url:
      store.state.apiConfiguration.url +
      gateway +
      `/dutyplansRecord/exportPdf`,
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

// 值班记录-批量下载值班记录报告
export function exportBatchRecord(data) {
  return axios({
    url:
      store.state.apiConfiguration.url +
      gateway +
      `/dutyplansRecord/batchExportPdf`,
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


  // 值班记录-生成值班记录报告
  export function editRecord(data) {
    return request({
      url: gateway + `/recordReport`,
      method: 'put',
      data
    })
  }

  
  // 值班记录-保存值班记录
  export function editReport(data) {
    return request({
      url: gateway + `/recordReport/editReport`,
      method: 'put',
      data
    })
  }