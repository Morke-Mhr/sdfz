import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 获取公告列表
export function getNoticeList(params) {
  return request({
    url: jurisdiction + '/notice/queryAll',
    method: 'get',
    params
  })
}

//新增通知公告
export function addNotice(data) {
  return request({
    url: jurisdiction + '/notice/noticeSubmit',
    method: 'post',
    data
  })
}

//通知公告查阅接口
export function noticeRead(params) {
  return request({
    url: jurisdiction + '/notice/noticeCheck',
    method: 'get',
    params
  })
}

//通知公告详情
export function noticeinfoRead(noticeId) {
  return request({
    url: jurisdiction + `/notice/${noticeId}`,
    method: 'get'
  })
}

//通知公告置顶接口
export function noticeTop(noticeId) {
  return request({
    url: jurisdiction + `/notice/noticeTop/${noticeId}`,
    method: 'get'
  })
}

// 删除通知公告
export function deleteNotice(noticeId) {
  return request({
    url: jurisdiction + `/notice/deletes/${noticeId}`,
    method: 'delete'
  })
}

// 发布通知公告
export function issueNotice(params) {
  return request({
    url: jurisdiction + '/notice/noticeRelease',
    method: 'get',
    params
  })
}
