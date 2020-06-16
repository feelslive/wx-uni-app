<template>
	<view class="order-card">
		<view class="order-card-top border_solid">
			<view class="order-card-top-yime" style="font-weight: bold;">{{ item.service_time }}</view>
			<view class="order-card-top-status">{{ item.status_name }}</view>
		</view>
		<view class="order-card-center border_solid">
			<view class="order-card-center-title">
				<text>{{ item.product_name }}· {{ item.used_time }}{{ item.used_unit }}</text>
				<!-- <text style="color:{{themeColor.color}};padding:4rpx 20rpx;border-radius:4rpx;margin-left:10rpx;font-size:28rpx;font-weight:400;background:{{themeColor.tintBg}}">{{item.used_time}}{{item.used_unit}}</text> -->
			</view>
			<view class="order-card-center-info">
				<van-icon name="manager" color="#DCDCDC" size="28rpx" />
				<view class="order-card-center-text">{{ item.user_name }} {{ item.user_mobile }}</view>
			</view>
			<view class="order-card-center-info">
				<van-icon name="location" color="#DCDCDC" size="28rpx" />
				<view class="order-card-center-text">{{ item.address }}</view>
			</view>
		</view>
		<view class="order-card-button">
			<view class="order-card-button-left">{{ item.service_user_name }}</view>
			<view class="order-card-button-right">
				<!-- v-if="{{item.status =='1' || item.status =='2'}}" -->
				<van-button custom-class="modify" plain :color="themeColor" :data-phone="item.store_mobile" round @tap="onPhone">修改时间</van-button>
			</view>
		</view>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
import Dialog from '../../wxcomponents/@vant/dialog/dialog';
export default {
	props: {
		item: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {};
	},
	computed: {
		themeColor() {
			return this.$store.state.color;
		}
	},
	components: {},
	methods: {
		onPhone(e) {
			console.log(e.currentTarget.dataset);
			Dialog.confirm({
				context: this,
				message: '请联系客服修改服务时间',
				confirmButtonText: '拨打电话'
			})
				.then(() => {
					wx.makePhoneCall({
						phoneNumber: e.currentTarget.dataset.phone
					});
				})
				.catch(() => {});
		}
	}
};
</script>

<style lang="scss">
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
	border-bottom: 1px solid #ededf0;
}
.order-card {
	padding-left: 30rpx;
	box-sizing: border-box;
	background: #fff;
	margin-top: 16rpx;
	&-top {
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		color: #333;
		font-size: 28rpx;
		&-status {
			padding-right: 30rpx;
		}
	}

	&-center {
		padding: 30rpx 30rpx 30rpx 0;
		position: relative;
		&-title {
			color: #333;
			font-size: 30rpx;
			line-height: 1;
			font-weight: 400;
			display: flex;
			align-items: center;
		}

		&-info {
			line-height: 1;
			display: flex;
			align-items: center;
			margin-top: 28rpx;
			font-size: 30rpx;
			color: #666;
		}

		&-text {
			width: 650rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-left: 10rpx;
		}
	}
	&-button {
		height: 96rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		&-left {
			color: #666;
			font-size: 28rpx;
		}
		&-right {
			.modify {
				font-size: 28rpx;
				color: #666;
				margin-right: 30rpx;
				height: 56rpx !important;
				line-height: 56rpx;
			}
		}
	}
}
</style>
