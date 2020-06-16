<template>
	<view>
		<view class="page-order-list">
			<!-- wx:if="{{dataList.length>0}}" -->
			<view class="order-tab">
				<van-tabs :active="active" swipeable nav-class="nav-fixed" @change="onChange" :color="themeColor">
					<van-tab title="待支付">
						<view v-if="dataList.length > 0">
							<block v-for="item in dataList" :key="index"><order-list :item="item" @onSuccess="onSuccess"></order-list></block>
						</view>
						<no-data :noData="noData" :noText="noText"></no-data>
					</van-tab>
					<van-tab title="可预约">
						<view v-if="dataList.length > 0">
							<block v-for="item in dataList" :key="index"><order-list :item="item" @onSuccess="onSuccess"></order-list></block>
						</view>
						<no-data :noData="noData" :noText="noText"></no-data>
					</van-tab>
					<van-tab title="全部">
						<view v-if="dataList.length > 0">
							<block v-for="item in dataList" :key="index"><order-list :item="item" @onSuccess="onSuccess"></order-list></block>
						</view>
						<no-data :noData="noData" :noText="noText"></no-data>
					</van-tab>
				</van-tabs>
			</view>
			<van-toast id="van-toast" />
		</view>
	</view>
</template>

<script>
import orderList from '../../../components/custom/order-list.vue';
import noData from '../../../components/custom/no-data.vue';
import { getOrderList } from '../../../interface/order.js';
export default {
	data() {
		return {
			dataList: [],
			active: 0,
			order_status: 1,
			page: 1,
			limit: 10,
			noData: false,
			noText: false,
			isShowTab: false
		};
	},
	components: {
		'order-list': orderList,
		'no-data': noData
	},
	computed: {
		themeColor() {
			return this.$store.state.color;
		}
	},
	onLoad(options) {
		console.log(options);
		this.active = Number(options.type);
		switch (this.active) {
			case 0:
				this.order_status = 1;
				break;
			case 1:
				this.order_status = 2;
				break;
			default:
				this.order_status = '';
				break;
		}
	},
	onShow() {
		this.noData = false;
		this.noText = false;
		this.page = 1;
		this.dataList = [];
		this.fetchOrderList().then(res => {
			this.dataList = res.data;
		});
	},
	methods: {
		onChange(e) {
			console.log(e.detail.index);
			this.noData = false;
			this.noText = false;
			this.page = 1;
			this.dataList = [];
			switch (e.detail.index) {
				case 0:
					this.order_status = 1;
					break;
				case 1:
					this.order_status = 2;
					break;
				default:
					this.order_status = '';
					break;
			}
			this.fetchOrderList().then(res => {
				this.dataList = res.data;
			});
		},
		fetchOrderList() {
			this.noData = false;
			this.noText = false;
			return new Promise((resolve, reject) => {
				uni.showLoading({
					title: '加载中...'
				});
				let params = {
					order_status: this.order_status,
					page: this.page,
					limit: this.limit
				};
				getOrderList(params)
					.then(res => {
						for (let key in res.data) {
							if (res.data[key].img_url == '') {
								res.data[key].img_url = '../../../static/def.png';
							}
						}
						resolve(res);
						if (res.data == null && this.page == 1) {
							this.noData = true;
						} else if (res.data == null && this.page > 1) {
							this.noText = true;
						} else if (res.data.length <= 9 && this.page >= 1) {
							this.noText = true;
						}
						uni.hideLoading();
					})
					.catch(err => {
						reject(err);
						uni.hideLoading();
						console.log(err);
					});
			});
		},
		onSuccess(res){
			console.log("支付")
			this.noData = false;
			this.noText = false;
			this.page = 1;
			this.dataList = [];
			this.fetchOrderList().then(res => {
				this.dataList = res.data;
			});
		}
	},
	onPullDownRefresh() {
		this.noData = false;
		this.noText = false;
		this.page = 1;
		this.dataList = [];
		this.fetchOrderList().then(res => {
			this.dataList = res.data;
		});
	},
	onReachBottom() {
		this.page = this.page + 1;
		if (!this.noText && !this.noData) {
			this.fetchOrderList().then(res => {
				console.log(res);
				if (res.data != null) {
					this.dataList = this.dataList.concat(res.data);
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f3f3f4;
}
.page-order-list {
	.nav-fixed {
		position: fixed;
		top: 0;
		width: 100%;
		height: 88rpx;
		background-color: #fff !important;
		box-shadow: 0 6rpx 10rpx -6rpx rgba(0, 0, 0, 0.19);
		z-index: 99999;
	}
	.order-none {
		display: flex;
		justify-content: center;
		margin-top: 30rpx;
	}
}
</style>
