import axios from 'axios'
import request from '@/utils/request'
import { getPublicParameters } from '@/utils/storage'

/**
 * @description 获取车场收费员
 * */
export function getCollectorList() {
  const comid = getPublicParameters('comid')
  const params = {
    comid: comid
  }
  return request({
    url: '/getdata/getalluser',
    method: 'get',
    params
  })
}

/**
 * @description 获取车场区域
 * */
export function getComAreaList() {
  const comid = getPublicParameters('comid')
  const params = {
    comid: comid
  }
  return request({
    url: '/getdata/getComArea',
    method: 'get',
    params
  })
}
