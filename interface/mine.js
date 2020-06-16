//consumer/getUserCenter
import {
	HTTP
} from './http.js'
/**
 * 首页获取基本信息
 */
export const getUserCenter = params => HTTP('/consumer/getUserCenter', params)

//consumer/updateConsumerAvatarUrl

export const updateUserInfo = params => HTTP('/consumer/updateConsumerAvatarUrl', params)

// 获取门店信息
export const getSupportStore = params => HTTP('/consumer/getProductSupportStore', params)

/**
 * 切换地址
 * store_id
 */
export const updateDefaultStore = params => HTTP('/consumer/updateDefaultStore', params)
