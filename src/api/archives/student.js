import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 学生学籍档案--列表查询
export function sRecordList(params) {
  return request({
    url: jurisdiction + `/student/list`,
    method: 'get',
    params
  })
}

// 学生学籍档案新增
export function sRecordAdd(data) {
  if (data.studentParents.length > 0) {
    for (var i = 0; i < data.studentParents.length; i++) {
      data['studentParents[' + i + '].name'] = data.studentParents[i].name
        ? data.studentParents[i].name
        : ''
      data['studentParents[' + i + '].relationshipValue'] = data.studentParents[
        i
      ].relationshipValue
        ? data.studentParents[i].relationshipValue
        : ''
      data['studentParents[' + i + '].contactInfo'] = data.studentParents[i]
        .contactInfo
        ? data.studentParents[i].contactInfo
        : ''
      data['studentParents[' + i + '].address'] = data.studentParents[i].address
        ? data.studentParents[i].address
        : ''
      data['studentParents[' + i + '].educationValue'] = data.studentParents[i]
        .educationValue
        ? data.studentParents[i].educationValue
        : ''
      data['studentParents[' + i + '].occupationValue'] = data.studentParents[i]
        .occupationValue
        ? data.studentParents[i].occupationValue
        : ''
    }
  }
  delete data.studentParents
  console.log(data)
  data = Object.entries(data).reduce((t, v) => {
    console.log(t, v, 'tttt')
    Reflect.apply(t.append, t, v)
    return t
  }, new FormData())
  console.log(data, 999)
  return request({
    url: jurisdiction + `/student`,
    method: 'post',
    data
  })
  // return axios({
  //   url: jurisdiction + `/student`,
  //   data: data ? data : '',
  //   responseType: 'blob',
  //   headers: {
  //     Authorization: getToken()
  //   },
  //   method: 'post'
  // })
}

// 学生学籍档案--删除
export function sRecordDel(studentInfoIds) {
  return request({
    url: jurisdiction + `/student/${studentInfoIds}`,
    method: 'DELETE'
  })
}

// 获取班级列表
export function getClassSelect() {
  return request({
    url: jurisdiction + `/class/getClassOptionSelect`,
    method: 'get'
  })
}

// 学生学籍档案-zip附件打包下载
export function zipDownload(data) {
  return axios({
    url:
      store.state.apiConfiguration.url +
      jurisdiction +
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
