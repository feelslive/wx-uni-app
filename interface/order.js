import {
	HTTP
} from './http.js'
/**
 * 用户订单列表
 */
export const getOrderList = params => HTTP('/consumer/getOrderList', params)

/**
 * 订单详情
 * order_number string 
 */
export const getOrderDetail = params => HTTP('/consumer/getOrderDetail', params)

/**
 * 获取支付
 * order_number string 
 * opendid -- 用户id
 */
export const getPayNeedParam = params => HTTP('/consumer/getPayNeedParam', params)


/**
*  new  订单预约
* @param {String} buy_num --- 
* @param {String} service_time --- 预约时间
* @param {String} order_number --- 产品名称
*/
export const reservationServe = params => HTTP('/consumer/reservationServe', params,'POST')