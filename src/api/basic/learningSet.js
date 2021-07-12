import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction


// 学制管理--列表查询
export function geteducational(params) {
    return request({
        url: jurisdiction + `/educational/list`,
        method: 'get',
        params
    })
}

// 学制管理--学制修改
export function puteducational(data) {
    return request({
        url: jurisdiction + `/educational/`,
        method: 'put',
        data
    })
}