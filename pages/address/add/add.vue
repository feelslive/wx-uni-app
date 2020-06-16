<template>
	<view>
		<view class="">
			<van-cell-group>
				<van-field :value="user.user_name" @input="inputName" label="联系人" placeholder="请输入用户名" input-align="right" />
				<van-field :value="user.user_mobile" @input="inputPhone" label="电话号码" type="number" placeholder="请输入手机号" input-align="right" />
				<van-cell @click="onOpenMap" v-if="user.user_address == ''" title="服务地址" is-link value="点击添加服务地址" />
				<van-cell @click="onOpenMap" v-else title="服务地址" value-class="black-color" is-link :value="user.user_address" />
				<van-field :value="user.user_address_desc" @input="inputText" label=" " type="textarea" input-align="right" placeholder="填写详细地址" autosize :border="false" />
			</van-cell-group>
		</view>
		<view class="save-btn">
			<view v-if="status == 'edit'" style="flex: 1;margin: 0 10rpx;"><van-button plain type="info" size="large" @click="onDelete" :color="themeColor">删除</van-button></view>
			<view :style="{ flex: status == 'edit' ? 3 : 1 }" style="margin: 0 10rpx;">
				<van-button type="info" size="large" @click="onSave" :color="themeColor">保存</van-button>
			</view>
		</view>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
import { addUserAddress, updateUserAddress, deleteUserAddress } from '../../../interface/address.js';
import { isTrim, isPhone } from '../../../utils/util.js';
import Toast from '../../../wxcomponents/@vant/toast/toast';
export default {
	data() {
		return {
			status: 'add',
			user: {
				user_name: '',
				user_mobile: '',
				user_address: '',
				user_address_desc: ''
			},
			lng: '',
			lat: ''
		};
	},
	computed: {
		themeColor() {
			return this.$store.state.color;
		}
	},
	onLoad(options) {
		console.log(options);
		if (options.type) {
			this.status = options.type;
			let title = '服务地址';
			if (this.type == 'add') {
				title = '新增服务地址';
			} else if (options.item) {
				let item = JSON.parse(options.item);
				this.user = item;
				title = '编辑服务地址';
			}
			uni.setNavigationBarTitle({
				title: title
			});
		}
		wx.getLocation({
			type: 'wgs84',
			success: res => {
				console.log(res);
				this.lng = res.longitude;
				this.lat = res.latitude;
			},
			fail: err => {
				console.log(err);
				this.getLocationAuth().then(res => {
					this.lng = res.longitude;
					this.lat = res.latitude;
				});
			}
		});
	},
	methods: {
		inputName(e) {
			console.log(e.detail);
			this.user.user_name = e.detail;
		},
		inputPhone(e) {
			console.log(e.detail);
			this.user.user_mobile = e.detail;
		},
		inputText(e) {
			console.log(e.detail);
			this.user.user_address_desc = e.detail;
		},
		// 打开地图
		onOpenMap() {
			this.getLocationAuth().then(res => {
				console.log(res);
				wx.chooseLocation({
					// latitude: res.latitude,
					// longitude: res.longitude,
					success: res => {
						console.log('chooseLocation', res);
						this.lng = res.longitude;
						this.lat = res.latitude;
						this.user.user_address = res.address;
					},
					fail: err => {}
				});
			});
		},
		onSave() {
			if (isTrim(this.user.user_name) == '') {
				Toast('联系人不能为空');
				return false;
			}
			if (!isPhone(this.user.user_mobile)) {
				Toast('手机号有误');
				return false;
			}
			if (this.status == 'add') {
				this.onAddAddress();
			} else {
				this.onUpdateAddress();
			}
		},
		onAddAddress() {
			let params = {
				user_name: this.user.user_name,
				user_mobile: this.user.user_mobile,
				user_address: this.user.user_address,
				user_address_desc: this.user.user_address_desc,
				lng: this.lng,
				lat: this.lat
			};
			addUserAddress(params)
				.then(res => {
					Toast.success('地址添加成功');
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				})
				.catch(err => {
					Toast.fail('地址添加失败');
				});
		},
		onUpdateAddress() {
			/**
			 * 编辑服务地址
			 * @param {String} user_address --- 服务地址
			 * @param {String} user_address_desc --- 服务地址的详情
			 * @param {String} user_name --- 服务地址的姓名
			 * @param {String} user_mobile --- 服务地址的手机号
			 * @param {String} address_id --- 地址列表的地址id
			 */
			let params = {
				address_id: this.user.id,
				user_name: this.user.user_name,
				user_mobile: this.user.user_mobile,
				user_address: this.user.user_address,
				user_address_desc: this.user.user_address_desc,
				lng: this.lng,
				lat: this.lat
			};
			updateUserAddress(params)
				.then(res => {
					Toast.success('地址更新成功');
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				})
				.catch(err => {
					Toast.fail('地址更新失败');
				});
		},
		onDelete() {
			let params = {
				address_id: this.user.id
			};
			deleteUserAddress(params)
				.then(res => {
					Toast.success('地址已删除');
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				})
				.catch(err => {
					Toast.fail('地址删除失败');
				});
		},
		getLocationAuth() {
			return new Promise((resolve, reject) => {
				let that = this;
				wx.getSetting({
					success(res) {
						if (res.authSetting['scope.userLocation']) {
							wx.authorize({
								scope: 'scope.userLocation',
								success() {
									wx.getLocation({
										type: 'wgs84',
										success(res) {
											// console.log(res)
											resolve(res);
										}
									});
								}
							});
						} else {
							console.log('没有授权');
							wx.showModal({
								title: '获取定位失败',
								content: '请点击按钮开启定位',
								confirmText: '开启定位',
								showCancel: false,
								confirmColor: that.themeColor,
								success(res) {
									if (res.confirm) {
										wx.openSetting({
											success(res) {
												console.log(res.authSetting);
											}
										});
									}
								}
							});
							reject();
						}
					},
					fail() {
						reject();
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
.black-color {
	color: #323233 !important;
	flex: 2 !important;
}
.save-btn {
	display: flex;
	align-items: center;
	position: fixed;
	bottom: 30rpx;
	left: 50%;
	transform: translate(-50%, 0);
	width: 640rpx;
}
</style>
