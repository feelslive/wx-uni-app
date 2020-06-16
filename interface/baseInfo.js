import {
	HTTP
} from './http.js'
/**
 * getOpenId
 */
export const getOpenId = params => HTTP('/data/getOpWxMiniAppOpenId', params)

export const getBaseInfo = params => HTTP('/consumer/getBaseSetting', params)
/**
 * 首页获取基本信息
 */
export const getIndexInfo = params => HTTP('/consumer/getIndexInfo', params)
