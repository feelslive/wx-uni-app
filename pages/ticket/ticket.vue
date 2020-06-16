<template>
	<view class="ticket-list">
		<van-tabs :active="active" swipeable nav-class="nav-fixed" :color="themeColor" @change="onChange">
			<van-tab title="有效">
				<view v-if="dataList.length > 0">
					<block v-for="item in dataList" :key="item.id"><serve-list :item="item"></serve-list></block>
				</view>
				<no-data :noData="noData" :noText="noText"></no-data>
			</van-tab>
			<van-tab title="已使用">
				<view v-if="dataList.length > 0">
					<block v-for="item in dataList" :key="item.id"><serve-list :item="item"></serve-list></block>
				</view>
				<no-data :noData="noData" :noText="noText"></no-data>
			</van-tab>
			<van-tab title="已失效">
				<view v-if="dataList.length > 0">
					<block v-for="item in dataList" :key="item.id"><serve-list :item="item"></serve-list></block>
				</view>
				<no-data :noData="noData" :noText="noText"></no-data>
			</van-tab>
		</van-tabs>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
import ticketList from '../../components/custom/ticket-list.vue';
import noData from '../../components/custom/no-data.vue';
import { getUserOwnCouponInfo } from '../../interface/ticket.js';
export default {
	data() {
		return {
			noData: false,
			noText: false,
			page: 1,
			dataList: [],
			active: 0,
			limit: 10,
			status: '1,2,3'
		};
	},
	components: {
		'ticket-list': ticketList,
		'no-data': noData
	},
	onLoad(options) {
		console.log(options);
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
		this.fetchServeList().then(res => {
			this.dataList = res.data;
		});
	},
	mounted() {},
	computed: {
		themeColor() {
			return this.$store.state.color;
		}
	},
	methods: {
		fetchServeList() {
			console.log('fetchServeList');
			this.noData = false;
			this.noText = false;
			return new Promise((resolve, reject) => {
				wx.showLoading({
					title: '加载中...',
					mask: true
				});
				// let params = {
				// 	status: this.status,
				// 	page: this.page,
				// 	limit: this.limit
				// };
				getUserOwnCouponInfo()
					.then(res => {
						console.log('res')
						resolve(res);
						if (res.data == null && this.page == 1) {
							this.noData = true;
						} else if (res.data == null && this.page > 1) {
							this.noText = true;
						} else if (res.length <= 9 && this.page >= 1) {
							this.noText = true;
						}
						wx.hideLoading();
					})
					.catch(err => {
						reject(err);
						wx.hideLoading();
						console.log(err);
					});
			});
		},
		onChange(e) {
			this.noData = false;
			this.noText = false;
			this.page = 1;
			this.dataList = [];
			this.$emit('changeServe', e.detail.index);
			switch (e.detail.index) {
				case 0:
					this.status = '1,2,3';
					break;
				case 1:
					this.status = 4;
					break;
				default:
					this.status = 0;
					break;
			}
			this.fetchServeList().then(res => {
				this.dataList = res.data;
			});
		}
	},
	onPullDownRefresh() {
		this.noData = false;
		this.noText = false;
		this.page = 1;
		this.dataList = [];
		this.fetchServeList().then(res => {
			this.dataList = res.data;
		});
	},
	onReachBottom() {
		this.page = this.page + 1;
		if (this.noData || this.noText) {
			return false;
		}
		this.fetchServeList().then(res => {
			if (res.data != null) {
				this.dataList = this.dataList.concat(res.data);
			}
		});
	}
};
</script>

<style lang="scss">
page {
	background: rgba(243, 243, 244, 1);
}
.ticket-list {
	padding-bottom: 160rpx;
	// min-height: 90vh;
	.nav-fixed {
		position: fixed;
		top: 0;
		width: 100%;
		height: 88rpx;
		background-color: #fff !important;
		box-shadow: 0 6rpx 10rpx -6rpx rgba(0, 0, 0, 0.19);
		z-index: 99999;
	}
}
.noData,
.noText {
	width: 100%;
	text-align: center;
	color: #999;
	font-size: 26rpx;
	margin-top: 30rpx;
	image {
		width: 380rpx;
		height: 510rpx;
	}
}
</style>
