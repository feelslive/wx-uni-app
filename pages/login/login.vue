<template>
	<view class="login-page">
		<view class="app-info">
			<image class="logo" :src="getAppInfo.appInfo.app_head_img"></image>
			<view class="">{{ getAppInfo.appInfo.app_nick_name }}</view>
		</view>
		<view class="bind-phone" v-if="!isAuto">
			<van-field :value="phone" @input="inputPhone" clearable type="number" label="手机号" placeholder="请输入手机号" border="false" />
			<van-field :value="sms" @input="inputSms" center clearable type="number" label="验证码" placeholder="请输入验证码" border="false" use-button-slot>
				<van-button v-if="!isSecond" slot="button" :color="getAppInfo.color" size="small" type="primary" @click="sendSms">发送验证码</van-button>
				<van-button plain disabled v-if="isSecond" slot="button" :color="getAppInfo.color" size="small" type="primary">{{ second }}s后重新获取</van-button>
			</van-field>
		</view>
		<view class="login-btn">
			<van-button type="info" size="large" open-type="getUserInfo" @getuserinfo="getUserInfo" :color="getAppInfo.color" :loading="isLoading" loading-text="加载中...">
				{{ isAuto ? '微信授权登陆' : '登陆' }}
			</van-button>
			<van-button plain type="info" size="large" @click="onPhoneLogin" :color="getAppInfo.color">{{ isAuto ? '手机号登陆' : '微信授权登陆' }}</van-button>
		</view>
		<van-dialog
			use-slot
			:show="show"
			confirm-button-text="允许"
			cancel-button-text="拒绝"
			:confirm-button-color="getAppInfo.color"
			show-cancel-button
			confirm-button-open-type="getPhoneNumber"
			@close="onClose"
			@getphonenumber="onGetPhoneNumber"
		>
			<image src="https://img.yzcdn.cn/1.jpg" />
			<view>申请获取您的手机号</view>
		</van-dialog>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
import { isPhone, isSixNum } from '../../utils/util.js';
import Toast from '../../wxcomponents/@vant/toast/toast';
import { userLogin, sendSms } from '../../interface/login.js';
export default {
	data() {
		return {
			isAuto: true,
			phone: '',
			sms: '',
			userInfo: {},
			show: false,
			isSecond: false,
			second: 60,
			isLoading: false
		};
	},
	computed: {
		getAppInfo() {
			return this.$store.state;
		}
	},
	mounted() {
		console.log('getAppInfo', this.getAppInfo);
		uni.setNavigationBarTitle({
			title: '登陆'
		});
	},
	methods: {
		getUserInfo(e) {
			console.log(e.detail.userInfo);
			if (e.detail.userInfo) {
				this.userInfo = e.detail.userInfo;
				if (this.isAuto) {
					this.show = true;
					return false;
				} else {
					if (!isPhone(this.phone)) {
						Toast('请输入正确的手机号');
						return false;
					}
					if (!isSixNum(this.sms)) {
						Toast('请输入正确的验证码');
						return false;
					}
				}
				this.submit()
				return false;
			}
		},
		onClose() {
			this.show = false;
		},
		onPhoneLogin() {
			this.isAuto = !this.isAuto;
		},
		onGetPhoneNumber(e) {
			console.log(e.detail.encryptedData);
			uni.showLoading({
			    title: '加载中'
			});
			let en = e.detail.encryptedData;
			let iv = e.detail.iv;
			if (en && iv) {
				this.submit(en, iv);
			}
		},
		inputPhone(e) {
			console.log(e.detail);
			this.phone = e.detail;
		},
		inputSms(e) {
			console.log(e.detail);
			this.sms = e.detail;
		},
		sendSms() {
			if (!isPhone(this.phone)) {
				Toast('请输入正确的手机号');
				return false;
			}
			this.isSecond = true;
			var timer = null;
			clearInterval(timer);
			timer = setInterval(() => {
				this.second -= 1;
				console.log('qq');
				if (this.second <= 0) {
					clearInterval(timer);
					this.second = 60;
					this.isSecond = false;
				}
			}, 1000);
			sendSms({
				type: 'xmjz_login',
				mobile: this.phone
			})
				.then(res => {
					// this.sms = res.data.code;
				})
				.catch(err => {
					this.isSecond = false;
					clearInterval(timer);
				});
		},
		submit(en = '', iv = '') {
			this.isLoading = true;
			let params = {};
			if (this.isAuto) {
				params = {
					login_type: 'hand_auth',
					encrypted_data: en,
					iv: iv
				};
			} else {
				params = {
					login_type: 'auth_code',
					mobile: this.phone,
					sms_code: this.sms
				};
			}
			console.log('登陆', params);
				userLogin(params)
					.then(res => {
						if (res.data.token) {
							this.isLoading = false;
							uni.hideLoading();
							uni.setStorageSync('token', res.data.token);
							this.$store.dispatch('login', {
								userInfo: this.userInfo,
								token: res.data.token
							});
							uni.navigateBack({
								delta: 1
							});
						}
					})
					.catch(err => {});
		}
	}
};
</script>

<style lang="scss">
.app-info {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 162rpx 0;
	.logo {
		height: 136rpx;
		width: 136rpx;
	}
}
.bind-phone {
	width: 640rpx;
	margin: 0 auto;
}
.login-btn {
	position: fixed;
	bottom: 254rpx;
	left: 50%;
	transform: translate(-50%, 0);
	width: 640rpx;
	.van-button {
		margin-bottom: 48rpx;
	}
}
</style>
