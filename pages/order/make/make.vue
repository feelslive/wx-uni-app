<template>
	<view>
		<van-cell title="项目" :value="product_name" value-class="product-name" />
		<van-cell :title="product_unit_name" v-if="product_type == '2'"><van-stepper :value="MinNum" min="1" :max="MaxNum" integer bind:change="onChange" /></van-cell>
		<van-cell :title="product_unit_name" v-else :value="MaxNum"></van-cell>
		<van-cell title="服务时间" :value="makeTime" required is-link @click="showTimeModel" />
		<select-time :timeShow="timeShow" :themeColor="themeColor" @onConfirm="onConfirm" @onCancel="onCancel" showDay="60"></select-time>
		<button @tap="onSubmit" class="time-btn" hover-class="hover-class" :style="{ background: themeColor }">确定</button>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
import selectTime from '../../../components/custom/select-time.vue';
import Toast from '../../../wxcomponents/@vant/toast/toast.js';
import {debounce} from '../../../utils/util.js'
import {reservationServe} from '../../../interface/order.js'
export default {
	data() {
		return {
			timeShow: false,
			makeTime: '请选择服务时间',
			num: '',
			MinNum: 1,
			MaxNum: null,
			product_type: '',
			product_name: '',
			order_number: '',
			product_unit_name: ''
		};
	},
	components: {
		'select-time': selectTime
	},
	computed: {
		themeColor() {
			return this.$store.state.color;
		}
	},
	onLoad(options) {
		console.log('options', options);
		let option = JSON.parse(options.params);
		let name = option.product_name;
		this.product_type = option.product_type;
		this.product_name = option.product_type == '1' ? name : name + '(套餐)';
		this.num = this.MinNum;
		this.MaxNum = option.remaining_time;
		this.order_number = option.order_number;
		this.product_unit_name = '数量（' + option.product_unit_name + ')';
	},
	mounted() {},
	methods: {
		onChange(event) {
			console.log(Number(event.detail));
			this.num = Number(event.detail);
		},
		showTimeModel() {
			this.timeShow = true;
		},
		onConfirm(e) {
			console.log(e);
			this.makeTime = e.makeTime;
			this.serviceTime = e.serviceTime;
			this.timeShow = false;
		},
		onCancel(e) {
			console.log(e);
			this.timeShow = false;
		},
		onSubmit: debounce(function () {
		    console.log("1234")
		    if (this.makeTime === "请选择服务时间") {
		        // Toast('请选择预约时间～')
		        Toast({
		            message: '请选择服务时间～',
		            duration: 1000,
		        });
		        return false
		    }
		    this.commitServe()
		}, 1000),
		commitServe() {
			let params = {
				order_number: this.order_number,
				service_time: this.serviceTime,
				buy_num: this.product_type == '1' ? this.MaxNum : this.num
			};
			reservationServe(params).then(res => {
				console.log(res);
				if (res.code === 0) {
					Toast({
						type: 'success',
						message: '提交成功',
						duration: 1500
					});
					setTimeout(() => {
						uni.navigateBack({
						    delta: 1
						});
					}, 1500);
				}
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
.product-name {
	color: #333 !important;
}
.time-btn {
	width: 690rpx;
	height: 94rpx;
	font-size: 36rpx;
	border-radius: 4rpx;
	border: none;
	color: #fff;
	position: fixed;
	bottom: 20rpx;
	left: 50%;
	transform: translateX(-50%);
	// margin-left: -345rpx;
}
.hover-class {
	opacity: 0.8;
}
.time-btn::after {
	border: none;
}
.van-cell__value {
	flex: 2 !important;
}
</style>
