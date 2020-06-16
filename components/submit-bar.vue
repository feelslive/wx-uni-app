<template>
	<van-submit-bar :button-text="btnText" :disabled="isDisabled" @submit="onSubmit">
		
		<view class="bar-left" v-if="showShop">
			<image v-if="shopIcon" :src="shopIcon" mode=""></image>
			<view class="bar-shop">
				{{shop}}
			</view>
		</view>
		<view class="bar-left" v-else>
			<view class="bar-pirce">{{pirce}}</view>
		</view>
		<view class="bar-tip" slot="tip" v-if="showTip">
			<image v-if="tipIcon" :src="tipIcon" mode=""></image>
			<view class="">{{tipText}}</view>
		</view>
	</van-submit-bar>
</template>

<script>
	export default {
		props: {
			btnText: {
				type: String,
				default: "确定"
			},
			pirce: {
				type: String,
				default: ""
			},
			shop: {
				type: String,
				default: ""
			},
			shopIcon: {
				type: String,
				default: ""
			},
			isDisabled: {
				type: Boolean,
				default: false
			},
			showTip: {
				type: Boolean,
				default: false
			},
			tipText: {
				type: String,
				default: ""
			},
			tipIcon: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				
			}
		},
		computed:{
			showShop(){
				return (this.shop == "" || this.shop == "true") ? false : true;
			}
		},
		created() {
			console.log(this.btnText)
		},
		methods: {
			onSubmit(e) {
				console.log(e)
				this.$emit('myEvent', "123")
			}
		}
	}
</script>

<style lang="scss">
	.bar-left {
		display: flex;
		align-items: center;
		width: 50vw;

		image {
			width: 28upx;
			height: 28upx;
		}
	}

	.bar-tip {
		display: flex;
		align-items: center;

		image {
			width: 20upx;
			height: 20upx;
		}
	}
</style>
