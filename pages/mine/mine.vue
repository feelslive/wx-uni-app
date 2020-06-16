<template>
	<view class="mine">
		<view class="user-info" :style="{ background: themeColor }">
			<image class="img_url" :src="memberData.img_url ? memberData.img_url : 'http://media.jiazhengye.cn/baseFile/miniPro/evaphpJpMmSV'" />
			<view class="user-info-name">{{ memberData.user_name }}</view>
		</view>
		<view class="user-box">
			<view class="user-card user-order">
				<view class="user-card-title border_solid">我的订单</view>
				<view class="user-card-items">
					<view class="user-card-item" @click="onOrderList" data-type="0">
						<van-icon name="todo-list-o" :info="awaitNum" :color="themeColor" size="56rpx" />
						<view class="">待支付</view>
					</view>
					<view class="user-card-item" @click="onOrderList" data-type="1">
						<van-icon name="balance-list-o" :info="mayNum" :color="themeColor" size="56rpx" />
						<view class="">可预约</view>
					</view>
					<view class="user-card-item" @click="onOrderList" data-type="2">
						<van-icon name="description" :color="themeColor" size="56rpx" />
						<view class="">全部</view>
					</view>
				</view>
			</view>
			<view class="user-card user-address" @click="onAddress">
				<view class="user-card-title border_solid">
					<view class="">我的地址</view>
					<van-icon name="arrow" color="#999" size="32rpx" />
				</view>
				<view class="user-card-items">
					<view class="user-card-address">{{ memberData.user_address || '暂无地址' }}</view>
				</view>
			</view>
			<view class="user-card user-serve">
				<view class="user-card-title border_solid">我的服务</view>
				<view class="user-card-items">
					<view class="user-card-item" @click="onTicket" data-type="0">
						<image class="" src="http://media.jiazhengye.cn/baseFile/miniPro/evaphp1gT7Az" />
						<view class="">优惠券</view>
					</view>
					<view class="user-card-item" @click="onPhone" data-type="1">
						<image class="" src="http://media.jiazhengye.cn/baseFile/miniPro/evaphpJtNR06" />
						<view class="">联系客服</view>
					</view>
					<view class="user-card-item" @click="onCheckShop" data-type="2">
						<image class="" src="http://media.jiazhengye.cn/baseFile/miniPro/evaphpMRRO8n" />
						<view class="">切换门店</view>
					</view>
				</view>
			</view>
		</view>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
import { getUserCenter, updateUserInfo } from '../../interface/mine.js';
import Dialog from '../../wxcomponents/@vant/dialog/dialog';
export default {
	data() {
		return {
			memberData: {},
			awaitNum: '',
			mayNum: ''
		};
	},
	computed: {
		themeColor() {
			return this.$store.state.color;
		}
	},
	onLoad() {
		let that = this;
		uni.$on('requestEnd', function(data) {
			console.log('mine requestEnd：' + data.msg);
			that.$setTabBar(2);
			that.setNavBar();
		});
	},
	onShow() {
		if (uni.getStorageSync('theme')) {
			this.$setTabBar(2);
			this.setNavBar();
		}
		this.getMineData();
	},
	mounted() {
		this.updateUserInfo();
	},
	methods: {
		setNavBar() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.themeColor,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
		},
		getMineData() {
			let params = {
				store_id: this.$store.state.appInfo.store_id
			};
			getUserCenter(params).then(res => {
				this.memberData = res.data;
				if(res.data){
					this.awaitNum = res.data.order_ing == 0 ? '' : res.data.order_ing;
					this.mayNum = res.data.order_pay_succ == 0 ? '' : res.data.order_pay_succ;
				}
			});
		},
		updateUserInfo() {
			wx.getSetting({
				success(res) {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称
						wx.getUserInfo({
							success: function(res) {
								var userInfo = res.userInfo;
								updateUserInfo({
									avatar_url: userInfo.avatarUrl,
									nick_name: userInfo.nickName,
									sex: userInfo.gender
								})
									.then(res => {})
									.catch(() => {});
							}
						});
					}
				}
			});
		},
		onOrderList(e) {
			console.log(e.currentTarget.dataset.type);
			uni.navigateTo({
				url: '../order/list/list?type=' + e.currentTarget.dataset.type
			});
		},
		onAddress() {
			uni.navigateTo({
				url: '../address/list/list'
			});
		},
		onPhone(e) {
			if (this.memberData && this.memberData.contact_mobile) {
				Dialog.confirm({
					context: this,
					message: this.memberData.contact_mobile,
					confirmButtonText: '拨打电话'
				})
					.then(() => {
						// on confirm
						wx.makePhoneCall({
							phoneNumber: this.memberData.contact_mobile //仅为示例，并非真实的电话号码
						});
					})
					.catch(() => {
						// on cancel
					});
			}
		},
		onTicket() {
			uni.navigateTo({
				url: '../ticket/ticket'
			});
		},
		onCheckShop() {
			uni.navigateTo({
				url: '../shop/shop'
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f3f3f4;
}
.mine {
	overflow: hidden;
	.border_solid::after {
		content: ' ';
		position: absolute;
		pointer-events: none;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		border-bottom: 1px solid #d7d7db;
	}
	.user-info {
		height: 186rpx;
		display: flex;
		align-items: flex-start;
		padding: 0 30rpx;
		image {
			width: 112rpx;
			height: 112rpx;
			border-radius: 50%;
			margin-right: 34rpx;
		}
		&-name {
			color: #fff;
			font-size: 32rpx;
			margin-top: 36rpx;
			line-height: 1;
		}
	}
	.user-box {
		position: absolute;
		top: 128rpx;
		left: 50%;
		transform: translateX(-50%);
		.user-card {
			width: 690rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			&-title {
				height: 80rpx;
				color: #333;
				font-size: 30rpx;
				line-height: 80rpx;
				text-indent: 20rpx;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.xx-icon {
					margin-right: 10rpx;
				}
			}
			&-items {
				display: flex;
				align-items: center;
				justify-content: space-around;
				margin-top: 28rpx;
				padding-bottom: 30rpx;
				.user-card-address {
					width: 100%;
					text-align: left;
					padding: 0 20rpx;
					font-size: 28rpx;
					color: #333;
					box-sizing: border-box;
				}
			}
			&-item {
				color: #333;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				image {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 16rpx;
				}
			}
		}
	}
}
</style>
