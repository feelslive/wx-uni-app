<template>
	<view class="">
		<view class="noData" v-if="noData">
			<!-- <image src="http://media.jiazhengye.cn/baseFile/miniPro/evaphpb00OS9" /> -->
			<image src="http://media.jiazhengye.cn/baseFile/miniPro/phphBR5Ba" />
			<view class="">{{hintText}}</view>
		</view>
		<view class="noText" v-if="noText">没有更多了</view>
	</view>
</template>

<script>
export default {
	props: {
		noData: {
			type: Boolean,
			default: false
		},
		noText: {
			type: Boolean,
			default: false
		},
		hintText:{
			type: String,
			default: "暂无数据"
		}
		
	}
};
</script>

<style scoped>
.noData,
.noText {
	width: 100%;
	text-align: center;
	color: #999;
	font-size: 26rpx;
	margin-top: 30rpx;
	margin-bottom: 50rpx;
}

.noData image {
	margin-top: 200rpx;
	width: 440rpx;
	height: 320rpx;
}
</style>
