import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

export function getfaceQueryList(params) {
  return request({
    url: serviceName + `/daoerInfo/faceQuery`,
    method: 'get',
    params
  })
}
//设备类型-下拉列表
export function getddeviceTypeselect() {
  return request({
    url: serviceName + `/devicetype/select`,
    method: 'get'
  })
}

//设备区域
export function getdeviceRegionselect() {
  return request({
    url: serviceName + `/deviceregion/select`,
    method: 'get'
  })
}

export function getfaceDaoerHistoryList(params) {
  //人脸识别
  return request({
    url: serviceName + `/faceDaoerHistory/list`,
    method: 'get',
    params
  })
}

export function getopenDoorList(deviceId) {
  //开启人脸
  return request({
    url: serviceName + `/daoerFace/openDoor?deviceId=${deviceId}`,
    method: 'get'
  })
}

export function getrebootDeviceList(deviceId) {
  //重启人脸
  return request({
    url: serviceName + `/daoerFace/rebootDevice?deviceId=${deviceId}`,
    method: 'get'
  })
}
