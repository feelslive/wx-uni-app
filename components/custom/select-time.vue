<template>
	<view>
		<!--日期弹出框-->
		<van-popup :show="timeShow" position="bottom" custom-style="height: 800rpx" @close="modelCancel">
			<view class="modal" v-bind:class="[timeShow ? 'modal_show' : 'modal_hide']">
				<!-- 点击弹出框外部关闭弹出框 custom-style="height: 48%;"-->
				<!-- <view class='modal_cancel' bindtap='modelCancel'></view> -->
				<van-toast id="van-toast" />
				<!-- 弹出框主体 -->
				<view class="modal_container">
					<!-- 头部显示 -->
					<view class="modal_header">
						<view class="modal_cancel-btn" @click="modelCancel">取消</view>
						<view class="modal_title">
							<view>服务时间</view>
							<view class="header_tip">可预约{{ showDay }}天内的的时段</view>
						</view>
						<view class="modal_confirm-btn" @click="modalConfirm">确定</view>
					</view>
					<!-- 日期 -->
					<view class="time">
						<scroll-view class="time_scroll" 
						scroll-x 
						v-bind:scroll-left="navScrollLeft" 
						scroll-with-animation>
							<view
								:data-index="index"
								:data-week="item.name"
								@click="timeClick"
								class="scroll_item"
								v-bind:class="[currentTab == index ? 'time_active' : '']"
								:style="{ color: currentTab == index ? themeColor : '#333', 
								borderColor: themeColor }"
								v-for="(item, index) in timeList"
								:key="index"
							>
								<view>{{ item.name }}</view>
								<view>{{ item.date }}</view>
							</view>
						</scroll-view>
					</view>
					<!-- 时间段 -->
					<view class="hour">
						<scroll-view class="hour_scroll" scroll-y="true">
							<view
								@click="hourClick"
								v-if="item.isShow"
								class="hour_item"
								v-bind:class="[item.isShow ? '' : 'hour_unactive', hourIndex == index ? 'hour_active' : '']"
								:style="{ background: hourIndex == index ? themeColor : '', borderColor: hourIndex == index ? themeColor : '' }"
								v-for="(item, index) in hourList"
								:key="index"
								:data-index="index"
								:data-isshow="item.isShow"
							>
								{{ item.hour }}
							</view>
							<view class="without" v-if="without">今日暂无可约时段</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script>
import { HOUR } from '../select-time/hour.js';
import Toast from '../../wxcomponents/@vant/toast/toast.js';
export default {
	// props: ['timeShow', 'showDay', 'themeColor'],
	props:{
		timeShow: {
			type: Boolean,
			default: false,
		},
		showDay: {
			type: String | Number,
			default: 365,
		},
		themeColor: {
			type: String,
			default: "#1AB396",
		}
	},
	data() {
		return {
			scrollAnimation:true,
			//日期
			timeList: [],
			//可预约天数
			// showDay: 365,
			//预约时间段
			hourList: HOUR,
			//是否显示
			// timeShow: false,
			currentTab: 0,
			//选择时间
			chooseHour: '',
			//选择日期
			chooseTime: '',
			hourIndex: -1,
			//预约时间
			makeTime: '',
			serviceTime: '',
			without: false,
			pixelRatio:'',
			windowHeight:'',
			windowWidth:'',
			navScrollLeft:0
		};
	},
	created() {
		this.init();
		console.log('timeShow', this.timeShow);
		wx.getSystemInfo({
			success: res => {
				this.pixelRatio = res.pixelRatio;
				this.windowHeight = res.windowHeight;
				this.windowWidth = res.windowWidth;
			}
		});
	},
	onLoad(){
		
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		//弹出按钮
		showTimeModel: function() {
			this.timeShow = !this.timeShow;
			this.chooseTime = this.timeList[0].date;
		},
		//点击外部取消
		modelCancel: function() {
			// this.timeShow = !this.timeShow;
			this.chooseTime = this.timeList[0].date;
			this.makeTime = this.makeTime == '' ? '' : this.makeTime;
			this.serviceTime = this.serviceTime == '' ? '' : this.serviceTime;
			this.$emit('onCancel', this.timeShow);
		},
		//点击确认
		modalConfirm: function() {
			if (this.makeTime == '') {
				Toast({
					context: this,
					message: '请选择预约时间～',
					duration: 1000
				});
			} else {
				console.log('this.makeTime', this.makeTime);
				// this.timeShow = !this.timeShow;
				this.chooseTime = this.timeList[0].date;
				this.makeTime = this.makeTime == '' ? '' : this.makeTime;
				this.serviceTime = this.serviceTime == '' ? '' : this.serviceTime;
				console.log('this.makeTime', this.makeTime);
				this.$emit('onConfirm', {
					serviceTime: this.serviceTime,
					makeTime: this.makeTime
				});
			}
		},
		//日期选择
		timeClick: function(e) {
			console.log(e)
			let cur = e.currentTarget.dataset.index;
			//每个tab选项宽度占1/5
			var singleNavWidth = this.windowWidth / 5;
			//tab选项居中
			this.navScrollLeft = (cur - 2) * singleNavWidth;
			console.log("navScrollLeft",this.navScrollLeft)
			if (this.currentTab == cur) {
				return false;
			} else {
				this.currentTab = cur;
			}
			console.log("currentTab",this.currentTab)
			//非今天-不判断超过当前时间点(所有时间点都可选择)
			if (e.currentTarget.dataset.index != 0) {
				var list = this.hourList;
				for (var i = 0; i < list.length; i++) {
					list[i].isShow = true;
				}
				this.hourList = list;
			} else {
				//今天-过时不可预约
				var hour = new Date().getHours() + 2;
				var Minutes = new Date().getMinutes();
				hour += Minutes > 30 ? 0.5 : 0;
				for (var i = 0; i < this.hourList.length; i++) {
					var list = this.hourList;
					if (this.hourList[i].n <= hour) {
						list[i].isShow = false;
						this.hourList = list;
					}
				}
				let isWithout = false;
				for (const item of this.hourList) {
					isWithout = item.isShow ? false : true;
				}
				this.without = isWithout;
			}
			this.week = e.currentTarget.dataset.week;
			// currentTab: e.currentTarget.dataset.index,
			this.chooseTime = this.timeList[e.currentTarget.dataset.index].date;
			this.makeTime = '';
			this.serviceTime = '';
			this.chooseHour = '';
			this.hourIndex = -1;
		},
		// 时间选择
		hourClick: function(e) {
			console.log(e);
			// 时间不可选择
			if (!e.currentTarget.dataset.isshow) {
				Toast({
					context: this,
					message: '当前时段不可预约～',
					duration: 1000
				});
				return false;
			}

			this.hourIndex = e.currentTarget.dataset.index;
			this.chooseHour = this.hourList[e.currentTarget.dataset.index].hour;
			var chooseTime = `${new Date().getFullYear()}-${this.chooseTime}(${this.week}) ${this.chooseHour}`;
			var serviceTime = `${new Date().getFullYear()}-${this.chooseTime} ${this.chooseHour}`;
			this.makeTime = chooseTime;
			this.serviceTime = serviceTime;
		},
		init: function() {
			Date.prototype.Format = function(format) {
				var o = {
					'M+': this.getMonth() + 1, //month
					'd+': this.getDate(), //day
					'h+': this.getHours(), //hour
					'm+': this.getMinutes(), //minute
					's+': this.getSeconds(), //second
					'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
					S: this.getMilliseconds() //millisecond
				};
				if (/(y+)/.test(format)) {
					format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
				}
				for (var k in o) {
					if (new RegExp('(' + k + ')').test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
					}
				}
				return format;
			};
			Date.prototype.DateAdd = function(interval, number) {
				number = parseInt(number);
				var date = new Date(this.getTime());
				switch (interval) {
					case 'y':
						date.setFullYear(this.getFullYear() + number);
						break;
					case 'm':
						date.setMonth(this.getMonth() + number);
						break;
					case 'd':
						date.setDate(this.getDate() + number);
						break;
					case 'w':
						date.setDate(this.getDate() + 7 * number);
						break;
					case 'h':
						date.setHours(this.getHours() + number);
						break;
					case 'n':
						date.setMinutes(this.getMinutes() + number);
						break;
					case 's':
						date.setSeconds(this.getSeconds() + number);
						break;
					case 'l':
						date.setMilliseconds(this.getMilliseconds() + number);
						break;
				}
				return date;
			};
			var dateList = [];
			var now = new Date();
			for (var i = 0; i < this.showDay; i++) {
				var d = {};
				var day = new Date().DateAdd('d', i).getDay();
				if (day == 1) {
					var w = '周一';
				}
				if (day == 2) {
					var w = '周二';
				}
				if (day == 3) {
					var w = '周三';
				}
				if (day == 4) {
					var w = '周四';
				}
				if (day == 5) {
					var w = '周五';
				}
				if (day == 6) {
					var w = '周六';
				}
				if (day == 0) {
					var w = '周日';
				}
				d.name = w;
				d.date = new Date().DateAdd('d', i).Format('MM-dd');
				dateList.push(d);
			}
			this.timeList = dateList;
			this.week = dateList[0].name;
			this.chooseTime = dateList[0].date;

			//初始化判断
			//当前时间
			var hour = new Date().getHours() + 2;
			var Minutes = new Date().getMinutes();
			hour += Minutes > 30 ? 0.5 : 0;
			for (var i = 0; i < this.hourList.length; i++) {
				var list = this.hourList;
				//过时不可选
				if (this.hourList[i].n <= hour) {
					list[i].isShow = false;
					this.hourList = list;
				}
			}
			let isWithout = false;
			for (const item of this.hourList) {
				isWithout = item.isShow ? false : true;
			}
			this.without = isWithout;
		}
	}
};
</script>

<style lang="scss">
/* 底部弹出timeModel按钮 */
.showBtn {
	position: absolute;
	bottom: 20rpx;
	width: 100%;
}

/* 是否显示 */
.modal_show {
	/* display: block; */
}

.modal_hide {
	/* display: none; */
}

/* 日期弹出框 */
.modal {
	/* position: fixed;
	    z-index: 999;
	    bottom: 0;
	    width: 100%;
	    height: 100%;
	    background: rgba(0, 0, 0, 0.3); */
}

/* 背景模板*/
.modal_cancel {
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
}

/* 弹出框主体 */
.modal_container {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 100%;
	background: #fff;
}

/* modal_header */
.modal_header {
	padding: 20rpx;
	text-align: center;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.modal_confirm-btn,
.modal_cancel-btn {
	width: 100rpx;
	height: 100rpx;
	line-height: 100rpx;
}
.modal_title {
	font-size: 32rpx;
}
/* header_tip */
.header_tip {
	position: relative;
	font-size: 24rpx;
	color: #999;
}

/* time日期主体view */
.time {
	background: #f7f7f7;
	text-align: center;
	font-size: 28rpx;
	/* box-shadow: 0 5rpx 10rpx #888888; */
}

/* time日期主体滚动view */
.time_scroll {
	white-space: nowrap;
	width: 100%;
	height: 100rpx;
	line-height: 50rpx;
}

.hour_scroll {
	height: 480rpx;
}

.scroll-view-item {
	height: 100rpx;
}

/* 日期 */
.scroll_item {
	display: inline-block;
	/* padding: 0 40rpx; */
	height: 100rpx;
	width: 20%;
	box-sizing: border-box;
}

/* time_active选择状态 */
.time_active {
	/* color: #159de3; */
	/* border-bottom: 4rpx solid #159de3; */
	border-bottom-width: 4rpx;
	border-bottom-style: solid;
}

/* 时间 */
.hour {
	padding: 20rpx 0 40rpx 20rpx;
}

.hour_item {
	width: 22%;
	box-sizing: border-box;
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 10rpx;
	text-align: center;
	float: left;
	border: 2rpx solid #eee;
	font-size: 28rpx;
	margin-right: 3%;
	margin-bottom: 20rpx;
}

/* hour_active*/

.hour_active {
	/* background: #159de3; */
	color: #fff;
	border-width: 2rpx;
	border-style: solid;
}

/* hour_unactive */

.hour_unactive {
	color: #999;
}
.without {
	color: #999;
	width: 100%;
	margin-top: 50rpx;
	text-align: center;
	margin-left: -20rpx;
}
</style>
