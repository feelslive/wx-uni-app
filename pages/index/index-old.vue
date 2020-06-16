<template>
	<view class="all-box">
		<!-- 首页 -->
		<view v-if="active === 0"><home :result="indexData" :theme="themeColors"></home></view>
		<view v-if="active === 1"><serve :result="serveData" @changeServe="changeServe"></serve></view>
		<view v-if="active === 2"><mine :result="mineData"></mine></view>
		<van-tabbar :active="active" :active-color="themeColors" inactive-color="#000" @change="onChangeTab">
			<van-tabbar-item icon="home-o" dot>首页</van-tabbar-item>
			<van-tabbar-item icon="search">服务</van-tabbar-item>
			<van-tabbar-item icon="friends-o">我的</van-tabbar-item>
		</van-tabbar>
	</view>
</template>

<script>
import { getIndexInfo } from '../../interface/baseInfo.js';
import { getServeList } from '../../interface/serve-order/index.js';
import { getUserCenter } from '../../interface/mine.js';
import home from '../../components/home.vue';
import mine from '../../components/mine.vue';
import serve from '../../components/serve.vue';
export default {
	data() {
		return {
			active: -1,
			serveIndex: 0,
			indexData: {},
			serveData: {},
			mineData: {}
		};
	},
	components: {
		home,
		mine,
		serve
	},
	computed: {
		themeColors() {
			return this.$theme;
		}
	},
	onLoad(options) {
		console.log('options', options);
		// let _self = this
		this.active = options && options.type ? Number(options.type) : this.active;
	},
	onShow() {
		
	},
	created() {
		
	},
	mounted() {
		console.log('123', this.$Route.query);
		if (this.$Route.query.type) {
			this.active = this.$Route.query.type;
			uni.setStorageSync('index_type', this.active);
		} else {
			this.active = 0;
			uni.setStorageSync('index_type', this.active);
		}
		this.setBarTitle(this.active);
		this.getData(this.active);
	},
	onPullDownRefresh() {
		console.log('refresh');
		// switch (this.active) {
		// 	case 0:
		// 		this.getIndexInfo();
		// 		break;
		// 	case 1:
		// 		this.getIndexInfo();
		// 		break;
		// 	case 2:
		// 		this.getIndexInfo();
		// 		break;
		// 	default:
		// 		break;
		// }
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1500);
	},
	onReachBottom() {
		console.log('23');
	},
	methods: {
		onChangeTab(event) {
			// wx.pageScrollTo({
			// 	scrollTop: 0,
			// 	duration: 0
			// });
			this.active = event.detail;
			uni.setStorageSync('index_type', this.active);
			this.setBarTitle(this.active);
			this.getData(this.active);
		},
		getData(active) {
			switch (active) {
				case 1:
					this.getServeInfo(active);
					break;
				case 2:
					this.getMineInfo(active);
					break;
				default:
					this.getIndexInfo(active);
					break;
			}
		},
		changeServe(e) {
			console.log(e, '555');
			this.serveIndex = e;
		},
		setBarTitle(type) {
			let title = '首页';
			let color = '#333';
			let bgColor = '#FFF';
			switch (type) {
				case 1:
					this.setBarInfo('服务单');
					break;
				case 2:
					this.setBarInfo('我的', '#ffffff', this.themeColors);
					break;
				default:
					this.setBarInfo('首页');
					break;
			}
		},
		getIndexInfo(active) {
			getIndexInfo()
				.then(res => {
					this.active = active;
					this.indexData = res.data;
					
				})
				.catch(err => {
					console.log(err);
				});
		},
		getServeInfo(active) {
			let params = {
				status: '1,2,3',
				page: 1,
				limit: 10
			};
			getServeList(params)
				.then(res => {
					this.active = active;
					this.serveData = res.data;
				})
				.catch(err => {
					console.log(err);
				});
		},
		getMineInfo(active) {
			let params = {
				store_id: 4136
			};
			getUserCenter(params)
				.then(res => {
					this.active = active;
					this.mineData = res.data;
					
				})
				.catch(err => {
					console.log(err);
				});
		},
		setBarInfo(title, color = '#000000', backgroundColor = '#ffffff') {
			console.log(color);
			uni.setNavigationBarTitle({
				title: title
			});
			uni.setNavigationBarColor({
				frontColor: color,
				backgroundColor: backgroundColor,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
