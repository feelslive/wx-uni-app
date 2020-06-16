<script>
import Vue from 'vue';
import { getOpenId, getBaseInfo } from './interface/baseInfo.js';
import { COLOR, ICON } from './theme/theme.js';
export default {
	data() {
		return {
			systemInfo: null,
			isIPhoneX: false
		};
	},
	globalData: {
		systemInfo: null,
		isIPhoneX: false
	},
	onLaunch: function() {
		console.log('App Launch');
		uni.login({
			provider: 'weixin',
			success: res => {
				console.log(res.code);
				getOpenId({
					code: res.code
				}).then(res => {
					if (res.data && res.data.openid) {
						uni.setStorageSync('openId', res.data.openid);
						uni.setStorageSync('needLogin', res.data.need_login);
						this.getBaseData().then(() => {
							// this.$setTabBar(0);
							uni.$emit('requestEnd',{msg:'请求结束'})
						});
					}
				});
			},
			fail: err => {
				console.log(`获取微信code失败========`, err);
			}
		});
		// 获取系统信息
		wx.getSystemInfo({
			success: res => {
				console.log(res);
				this.systemInfo = res;
				const iphoneX = /iphone x/i.test(res.model);
				const iphoneNew = /iPhone11/i.test(res.model) && res.screenHeight === 812;
				this.isIPhoneX = iphoneX || iphoneNew;
				console.log('this.isIPhoneX', this.isIPhoneX);
				uni.setStorageSync('iphoneX', this.isIPhoneX);
			}
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		getBaseData() {
			return new Promise((resolve, reject) => {
				getBaseInfo()
					.then(res => {
						uni.setStorageSync('store_id', res.data.store_id);
						uni.setStorageSync('theme', res.data.theme);
						this.$store.dispatch('setAppInfo', res.data);
						this.$store.dispatch('setColor', COLOR[res.data.theme]);
						resolve();
					})
					.catch(err => {
						uni.showModal({
							title: '提示',
							content: '未获取到当前小程序信息，请您删除小程序或稍后再试',
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
									uni.navigateBack({
										delta: 0
									});
								} else if (res.cancel) {
									console.log('用户点击取消');
									uni.navigateBack({
										delta: 0
									});
								}
							}
						});
						reject();
					});
			});
		},
	}
};
</script>

<style lang="scss">
@import 'wxcomponents/@vant/common/index.wxss';
@import 'style/index.wxss';
@import 'style/theme.wxss';
@import 'uni.scss';
</style>
