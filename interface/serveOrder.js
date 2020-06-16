import {HTTP} from './http.js'
/**
 * 用户订单列表
 */
export const getServeList = params => HTTP('/consumer/getServeList', params)