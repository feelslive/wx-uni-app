<template>
	<view class="order-card">
		<view class="order-card-top">
			<view class="order-card-top-yime">{{ item.create_time }}</view>
			<view class="order-card-top-status" style="color:#333">{{ item.order_status_name }} ¥{{ item.pay_actual }}</view>
		</view>
		<view class="order-card-center border_solid" @click="onOrderDetail" :data-id="item.order_number">
			<view class="order-card-center-box">
				<view class="order-card-center-icon"><image class="" :src="item.img_url" :data-index="item.order_number" binderror="onErrorImg" /></view>
				<view class="order-card-center-project">
					<view class="order-card-center-title" v-if="item.product_type == '2'">{{ item.product_name }}【{{ item.product_type_name }}】</view>
					<view class="order-card-center-title" v-else>{{ item.product_name }}</view>
					<view class="order-card-center-info" v-if="item.product_type == '2' && item.service_expire_time != ''">
						<view class="order-card-center-text">
							有效期:{{ item.service_start_time }}
							<text>至{{ item.service_expire_time }}</text>
						</view>
					</view>
					<view class="order-card-center-info">
						<view class="order-card-center-text">{{ item.address }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-card-button">
			<view class="order-card-button-left">剩{{ item.remaining_time }}/共{{ item.total_num }}</view>
			<view class="order-card-button-right">
				<!--  -->
				<van-button
					custom-class="modify"
					plain
					round
					@click="onMakeOrder"
					:data-type="item.product_type"
					:data-name="item.product_name"
					:data-id="item.order_number"
					:data-num="item.remaining_time"
					:data-unit="item.product_unit_name"
					v-if="item.order_status == '2' && item.remaining_time >= 1"
				>
					预约项目
				</van-button>
				<van-button custom-class="modify" plain round color="#FF4242" :data-orderid="item.order_number" @click="onPay" v-if="item.order_status == '1'">去支付</van-button>
			</view>
		</view>
	</view>
</template>

<script>
import { getPayNeedParam } from '../../interface/order.js';
import Toast from '../../wxcomponents/@vant/toast/toast';
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
	methods: {
		onOrderDetail(e) {
			console.log(e.currentTarget.dataset);
			let id = e.currentTarget.dataset.id;
			if (id) {
				uni.navigateTo({
					url: '/pages/order/detail/detail?id=' + id
				});
			}
		},
		onMakeOrder(e) {
			let params = {
				product_name: e.currentTarget.dataset.name,
				product_type: e.currentTarget.dataset.type,
				order_number: e.currentTarget.dataset.id,
				remaining_time: e.currentTarget.dataset.num,
				product_unit_name: e.currentTarget.dataset.unit
			};
			console.log(params);
			uni.navigateTo({
				url: '/pages/order/make/make?params=' + JSON.stringify(params)
			});
		},
		onErrorImg(e) {
			// this.item.img_url = '../../../static/def.png';
		},
		onPay(e) {
			console.log('e.currentTarget.dataset', e.currentTarget.dataset);
			let order_number = e.currentTarget.dataset.orderid;
			getPayNeedParam({
				openid: wx.getStorageSync('openId'),
				order_number: order_number
			}).then(res => {
				const { timeStamp, nonceStr, paySign, signType } = res.data;
				console.log('getPayNeedParam', res);
				wx.requestPayment({
					timeStamp,
					nonceStr,
					package: res.data.package,
					signType,
					paySign,
					success: result => {
						Toast({
							type: 'success',
							message: '支付成功',
							duration: 1000
						});
						this.$emit('onSuccess', result);
					},
					fail: err => {
						console.log(err);
						Toast({
							type: 'fail',
							message: '支付已取消',
							duration: 1000
						});
					}
				});
			});
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
	border-bottom: 1px solid #d7d7db;
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
			font-weight: 600;
			padding-right: 30rpx;
		}
	}

	&-center {
		padding: 30rpx 30rpx 30rpx 0;
		position: relative;

		&-box {
			display: flex;
			overflow: hidden;
		}

		&-project {
			flex: 1;
			overflow: hidden;
		}

		&-icon {
			margin-right: 24rpx;

			image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 8rpx;
			}
		}

		&-title {
			color: #333;
			font-size: 30rpx;
			line-height: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
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
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 26rpx;
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
				// width: 168rpx;
				height: 56rpx !important;
				line-height: 56rpx;
			}
		}
	}
}
</style>
