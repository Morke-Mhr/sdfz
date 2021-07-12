import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'
const listenClass = store.state.serviceName.listenClass

// 公共资源-根据层级查看文件或者文件夹
export function publicFolderList(params) {
  return request({
    url: listenClass + `/personFolder/list`,
    method: 'get',
    params
  })
}

// 个人资源-增加文件夹
export function addFolder(data) {
  return request({
    url: listenClass + `/personFolder/addFolder`,
    method: 'post',
    data
  })
}

// 个人资源-增加文件
export function addFile(data) {
  return request({
    url: listenClass + `/personFolder/addFile`,
    method: 'post',
    data
  })
}

// 公共资源-修改文件或者文件夹
export function folderUpdate(data) {
  return request({
    url: listenClass + `/personFolder/update`,
    method: 'post',
    data
  })
}

// 公共资源-删除文件或者文件夹
export function folderDelete(data) {
  return request({
    url: listenClass + `/personFolder/delete`,
    method: 'post',
    data
  })
}

// 公共资源-下载文件夹以及文件
export function downloadFile(data) {
  return axios({
    url:
      store.state.apiConfiguration.url +
      listenClass +
      `/personFile/downloadFile`,
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
