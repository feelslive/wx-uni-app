import {
	HTTP
} from './http.js'
/**
 * 获取用户手机号或者用户授权手机号后用户登录
 * @param {String} login_type --- 	用户选择的登录类型 auth_code:验证码登录 hand_auth：手动授权登录
 * @param {String} mobile ---登录类型为auth_code的时候此参数必填
 * @param {String} sms_code --- 登录类型为auth_code的时候此参数必填 可跳过验证手机号 18513853090 密码 202002
 * @param {String} encrypted_data ---登录类型为 hand_auth此参数必填
 * @param {String} iv ---登录类型为 hand_auth此参数必填
 */
export const userLogin = params => HTTP('/auth/consumerLogin', params, 'POST')

/**
 * 获取用户手机号或者用户授权手机号后用户登录
 * @param {String} type ---  值：xmjz_login
 * @param {String} mobile --- 手机号
 */
export const sendSms = params => HTTP('/data/clientSendSmsCode', params)
