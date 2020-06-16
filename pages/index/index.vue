<template>
	<view class="all-box">
		<!-- 首页 -->
		<view class="content">
			<!-- 顶部轮播图 -->
			<view class="all-swiper" v-if="swiperList.length > 0">
				<view class="swiper-box" style="height: 308upx;">
					<swiper class="banner-swiper" circular="true" autoplay="true" @change="changeBanner">
						<swiper-item v-for="item in swiperList" :key="item.id"><image :src="item.icon_url" @tap="handleFunc(JSON.stringify(item))"></image></swiper-item>
					</swiper>
					<view class="dots" v-if="indicatorDotsOne">
						<block v-for="(item, index) in swiperList" :key="index"><view class="dot" :class="{ active: index == currentBannerSwiper }"></view></block>
					</view>
				</view>
			</view>
			<!-- 分类列表 -->
			<view class="all-swiper" v-if="itemList.length > 0">
				<view class="swiper-box">
					<swiper :style="{ height: maxHeight + 'px' }" class="category-swiper" @change="changeCategory">
						<swiper-item v-for="swiper in itemList" :key="swiper.id">
							<view class="category-list">
								<view @tap="handleFunc(JSON.stringify(item))" class="category" v-for="(item, index) in swiper" :key="index">
									<view class="img"><image :src="item.icon_url"></image></view>
									<view class="text">{{ item.name }}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="dots" v-if="indicatorDotsTwo">
						<block v-for="(item, index) in itemList" :key="index"><view class="dot" :class="{ active: index == currentCategorySwiper }"></view></block>
					</view>
				</view>
			</view>
			<!-- 活动轮播图 -->
			<view class="all-swiper" v-if="activityList.length > 0">
				<view class="swiper-box" style="height: 180upx;">
					<swiper class="activity-swiper" circular="true" autoplay="true" @change="changeActivity">
						<swiper-item v-for="item in activityList" :key="item.id"><image :src="item.icon_url" @tap="handleFunc(JSON.stringify(item))"></image></swiper-item>
					</swiper>
					<view class="dots" v-if="indicatorDotsThree">
						<block v-for="(item, index) in activityList" :key="index"><view class="dot" :class="{ active: index == currentActivitySwiper }"></view></block>
					</view>
				</view>
			</view>
			<!-- 热门推荐 -->
			<view class="hot-project" v-if="hotItems.length > 0">
				<view class="hot-title" :class="$theme">热门推荐</view>
				<view class="hot-items">
					<view class="hot-item" v-for="(item, index) in hotItems" @tap="handleFunc(JSON.stringify(item))" :key="index">
						<image class="hot-items-img" :src="item.icon_url" mode=""></image>
						<view class="hot-items-name">{{ item.name }}</view>
					</view>
				</view>
			</view>
			<!-- 门店 -->
			<view class="shop" v-if="shopInfo.name">
				<view class="shop-title">
					<image :src="shopInfo.logo" mode=""></image>
					<view class="shop-name">{{ shopInfo.name }}</view>
				</view>
				<view class="shop-desc">{{ shopInfo.remark }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getIndexInfo, getBaseInfo } from '../../interface/baseInfo.js';
import { COLOR, ICON } from '../../theme/theme.js';
export default {
	data() {
		return {
			active: 0,
			swiperList: [], // 轮播图片
			categoryList: [], // 分类
			itemList: [],
			activityList: [],
			hotItems: [],
			shopInfo: {},
			currentBannerSwiper: 0,
			currentCategorySwiper: 0,
			currentActivitySwiper: 0,
			indicatorDotsOne: false,
			indicatorDotsTwo: false,
			indicatorDotsThree: false,
			maxHeight: 368
		};
	},
	computed: {
		themeColor() {
			return this.$store.state.color;
		}
	},
	onLoad() {
		// this.getBaseData().then(() => {
		// 	this.$setTabBar(0);
		// });
		let that = this;
		uni.$on('requestEnd', function(data) {
			console.log('index requestEnd：' + data.msg);
			that.$setTabBar(0);
		});
	},
	onShow() {
		if (uni.getStorageSync('theme')) {
			this.$setTabBar(0);
		}
	},
	onReady() {},
	created() {},
	mounted() {
		this.getData();
		this.$nextTick(function() {});
	},

	methods: {
		getData() {
			getIndexInfo()
				.then(res => {
					// console.log(res.data.icon[0])
					this.swiperList = res.data.top_banner;
					this.activityList = res.data.activity_promotion;
					this.hotItems = res.data.bottom_banner;
					this.categoryList = res.data.icon[0];
					this.shopInfo = res.data.company_info;
					this.itemList = this.arrTrans(8, this.categoryList);
					this.indicatorDotsOne = this.swiperList.length >= 2 ? true : false;
					this.indicatorDotsTwo = this.itemList.length >= 2 ? true : false;
					this.indicatorDotsThree = this.activityList.length >= 2 ? true : false;
					this.maxHeight = this.categoryList.length > 4 ? 368 : 100;
				})
				.catch(err => {
					console.log(err);
				});
		},
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
		onChangeTab(event) {
			wx.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
			console.log(event);
			// event.detail 的值为当前选中项的索引
			this.active = event.detail;
		},
		changeBanner(event) {
			// console.log(event.detail.current);
			this.currentBannerSwiper = event.detail.current;
		},
		changeCategory(event) {
			// console.log(event.detail.current);
			this.currentCategorySwiper = event.detail.current;
		},
		changeActivity(event) {
			this.currentActivitySwiper = event.detail.current;
		},
		handleFunc(item) {
			// 分类跳转
			console.log('params', JSON.parse(item));
			let params = JSON.parse(item);
			let jump_type = params.jump_type;
			uni.navigateTo({
				url: `../project/${jump_type}?uuid=${params.uuid}`
			});
		},
		arrTrans(num, arr) {
			// 一维数组转换为二维数组
			const iconsArr = []; // 声明数组
			arr.forEach((item, index) => {
				const page = Math.floor(index / num); // 计算该元素为第几个素组内
				if (!iconsArr[page]) {
					// 判断是否存在
					iconsArr[page] = [];
				}
				iconsArr[page].push(item);
			});
			return iconsArr;
		}
	}
};
</script>

<style lang="scss" scoped>
.all-box {
	padding-bottom: 200rpx;
}
.content {
	padding: 0 30upx;
}

.all-swiper {
	width: 100%;
	margin-top: 10upx;
	display: flex;
	justify-content: center;

	.swiper-box {
		width: 100%;
		// height: 308upx;
		overflow: hidden;
		border-radius: 15upx;
		box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
		//兼容ios，微信小程序
		position: relative;
		z-index: 1;

		swiper {
			width: 100%;

			swiper-item {
				image {
					width: 100%;
					height: 308upx;
				}
			}
		}

		.banner-swiper {
			height: 308upx;
		}

		.category-swiper {
			max-height: 400upx;
		}

		.activity-swiper {
			height: 180upx;
		}
	}
}

.dots {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 20upx;
	display: flex;
	justify-content: center;

	.dot {
		margin: 0 5rpx;
		width: 20rpx;
		height: 8rpx;
		background: #999;
		border-radius: 8rpx;
		transition: all 0.6s;
	}

	.dot.active {
		width: 20rpx;
		background: #333;
	}
}

.category-list {
	width: 100%;
	// border-bottom: solid 2upx #f6f6f6;
	display: flex;
	// justify-content: space-between;
	flex-wrap: wrap;

	.category {
		width: 25%;
		margin-top: 50upx;
		display: flex;
		flex-wrap: wrap;

		.img {
			width: 100%;
			display: flex;
			justify-content: center;

			image {
				width: 11vw;
				height: 11vw;
			}
		}

		.text {
			margin-top: 16upx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 24upx;
			color: #3c3c3c;
		}
	}
}

.hot-project {
	.hot-title {
		@include text-color($black-color);
		font-size: 35upx;
		font-weight: 700;
		margin: 28upx 0;
	}

	.hot-items {
		display: flex;
		flex-wrap: wrap;

		// padding: 0 20upx;
		.hot-item {
			width: 50%;
			height: 50%;
			text-align: center;
			margin-bottom: 20upx;
		}

		&-img {
			width: 332upx;
			height: 332upx;
			margin: 0;
			padding: 0;
			border-radius: 8upx;
		}

		&-name {
			width: 50%;
			font-size: 28upx;
			margin: 20upx 0;
			line-height: 1;
			padding-left: 10rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			text-align: left;
		}
	}
}

.shop {
	margin-bottom: 50upx;

	&-title {
		display: flex;
		align-items: flex-end;
		margin-bottom: 40upx;

		image {
			width: 72upx;
			height: 72upx;
			border-radius: 8upx;
		}

		.shop-name {
			@include text-color($black-color); /* 采用函数调用 */
			font-size: 32upx;
			line-height: 1;
			margin-left: 16upx;
		}

		.shop-desc {
		}
	}
}
</style>
