// const Qs = require('qs');
import request from '@/utils/request'
import { getPublicParameters } from '@/utils/storage'
// 车场权限下需要的公共参数
const comid = getPublicParameters('comid')
const loginuin = getPublicParameters('loginuin')
const nickname1 = getPublicParameters('nickname1')
const roleid = getPublicParameters('roleid')
const publicParams = {
  comid: comid,
  loginuin: loginuin,
  nickname1: nickname1,
  roleid: roleid
}
// 订单管理 - 在场订单
/**
 * @description 车场端权限 必传comid
 * @param {*} params
 * @returns
 */
export function getOnSiteOrderList(params) {
  Object.assign(params, publicParams)
  return request({
    url: '/order/query',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}

export function getReductionRecordList(params) {
  Object.assign(params, publicParams)
  return request({
    url: '/reducerecord/query',
    method: 'post',
    params
  })
}
