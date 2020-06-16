import {
	HTTP
} from './http.js'


/**
 * 获取服务地址
 */
export const getUserAddress = params => HTTP('/consumer/getUserAddress', params)
/**
 * 增加服务地址
 * @param {String} user_address --- 服务地址
 * @param {String} user_address_desc --- 服务地址的详情
 * @param {String} user_name --- 服务地址的姓名
 * @param {String} user_mobile --- 服务地址的手机号
 */
export const addUserAddress = params => HTTP('/consumer/addUserAddress', params, 'POST')
/**
 * 编辑服务地址
 * @param {String} user_address --- 服务地址
 * @param {String} user_address_desc --- 服务地址的详情
 * @param {String} user_name --- 服务地址的姓名
 * @param {String} user_mobile --- 服务地址的手机号
 * @param {String} address_id --- 地址列表的地址id
 */
export const updateUserAddress = params => HTTP('/consumer/updateUserAddress', params, 'POST')

/**
 * 删除服务地址
 * @param {String} address_id --- 地址列表的地址id
 */
export const deleteUserAddress = params => HTTP('/consumer/deleteUserAddress', params, 'POST')

/**
 * 设置服务地址
 * @param {String} address_id --- 地址列表的地址id
 */

export const setDefaultAddress = params => HTTP('/consumer/setDefaultAddress', params, 'POST')
