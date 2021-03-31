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
// 系统管理 - 黑名单管理
/**
 * @description 车场端权限 必传comid
 * @param {*} params
 * @returns
 */
export function getBlacklist(params) {
  Object.assign(params, publicParams)
  return request({
    url: '/blackuser/query',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}

/**
 * @description 添加黑名单
 * @param params
 * @return {AxiosPromise}
 */
export function addBlacklist(params) {
  Object.assign(params, publicParams)
  return request({
    url: '/blackuser/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}


/**
 * @description 编辑黑名单
 * @param params
 * @return {AxiosPromise}
 */
export function editBlacklist(params) {
  Object.assign(params, publicParams)
  return request({
    url: '/blackuser/edit',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}

/**
 * @description 删除黑名单
 * @param params
 * @return {AxiosPromise}
 */
export function delBlacklist(params) {
  Object.assign(params, publicParams)
  return request({
    url: '/blackuser/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
  })
}
