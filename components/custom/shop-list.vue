<template>
	<view class="page-member-check  page-member-check-bg">
		<view class="card-shop" @click="onSelect" :data-id="shop.store_id">
			<view class="shop-name">
				<view class="">{{ shop.name }}</view>
				<view class="iconfont xx-icon-store_current" v-if="shop.is_now_store" style="font-size: 88rpx;" :style="{ color: themeColor }"></view>
			</view>
			<view class="shop-phone">
				<view class="shop-item-key">
					<view class="">电</view>
					<view class="">话：</view>
				</view>
				<view class="shop-item-val">{{ shop.mobile }}</view>
				<view class="" @click.stop="call" :data-phone="shop.mobile"><image src="http://media.jiazhengye.cn/baseFile/miniPro/evaphpSWjfWP" /></view>
			</view>
			<view class="shop-address">
				<view class="shop-item-key">
					<view class="">地</view>
					<view class="">址：</view>
				</view>
				<view class="shop-item-val">{{ shop.address }}</view>
			</view>
			<view class="shop-desc">
				<view class="shop-item-key">门店描述：</view>
				<view class="shop-item-val">{{ shop.detail }}</view>
			</view>
			<view class="select-icon iconfont xx-icon-duihao" v-if="shop.isSelect" style="font-size: 44rpx;" :style="{ color: themeColor }"></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		shop: {
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
	mounted() {
	},
	methods: {
		call(e) {
			let phone = e.currentTarget.dataset.phone
			this.$emit("onCall",phone)
		},
		onSelect(e) {
			let store_id = e.currentTarget.dataset.id;
			this.$emit("onSelect",store_id)
		}
	}
};
</script>

<style lang="scss">
.page-member-check-bg {
	background-color: #ffffff !important;
	margin-bottom: 20rpx;
}
.card-shop {
	padding: 0 32rpx;
	position: relative;
	.shop-name {
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333;
		font-size: 30rpx;
		margin-bottom: 8rpx;
	}
	.shop-phone,
	.shop-address,
	.shop-desc {
		display: flex;
		align-items: center;
		padding-bottom: 24rpx;
		color: #666;
		font-size: 28rpx;
		line-height: 1;
		.shop-item-key {
			width: 142rpx;
		}
		.shop-item-val {
			padding-right: 20rpx;
		}
	}

	.shop-phone,
	.shop-address {
		.shop-item-key {
			display: flex;
			justify-content: space-between;
			// letter-spacing: 10rpx;
		}
	}

	.shop-desc,
	.shop-address {
		.shop-item-val {
			flex: 1;
			line-height: 38rpx;
		}
	}
	.shop-phone {
		align-items: center;
		image {
			width: 130rpx;
			height: 32rpx;
		}
	}
	.select-icon {
		position: absolute;
		right: 32rpx;
		top: 100rpx;
	}
}
</style>
