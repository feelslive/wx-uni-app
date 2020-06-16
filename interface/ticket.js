//consumer/getUserCenter
import {HTTP} from './http.js'
/**
 * 优惠券的个人中心
 */
export const getUserOwnCouponInfo = params => HTTP('/consumer/getUserOwnCouponInfo', params)