<template>
	<view class="address">
		<view class="address-card" v-for="item in list" :key="item.id">
			<view class="item-info" @click="onSelect" :data-id="item.id">
				<view class="">{{ item.user_address }}{{ item.user_address_desc }}</view>
				<view class="">{{ item.user_name }} {{ item.user_mobile }}</view>
			</view>
			<view class="item-edit" @click.sotp="onAddEdit" data-type="edit" :data-item="item">
				<view class="iconfont xx-icon-edit_address" style="font-size: 36rpx;" :style="{ color: themeColor }"></view>
			</view>
			<view class="item-select iconfont xx-icon-store_current" style="font-size: 88rpx;" :style="{ color: themeColor }" v-if="item.is_default"></view>
		</view>
		<no-data :noData="noData" hintText="暂无服务地址"></no-data>
		<view class="add-btn" @click="onAddEdit" data-type="add"><van-button type="info" size="large" :color="themeColor">新增地址</van-button></view>
	</view>
</template>

<script>
import { getUserAddress, setDefaultAddress } from '../../../interface/address.js';
import noData from '../../../components/custom/no-data.vue';
export default {
	data() {
		return {
			list: [],
			noData: false
		};
	},
	components: {
		'no-data': noData
	},
	computed: {
		themeColor() {
			return this.$store.state.color;
		}
	},
	onLoad() {},
	onShow() {
		this.getAddressList();
	},
	methods: {
		getAddressList() {
			getUserAddress()
				.then(res => {
					if (res.data) {
						this.noData = false
						this.list = res.data;
					}else{
						this.list = [];
						this.noData = true
					}
				})
				.catch(err => {});
		},
		setDefAddress(id) {
			let params = {
				address_id: id
			};
			setDefaultAddress(params)
				.then(res => {
					if (res.data) {
						uni.navigateBack({
							delta: 1
						});
					}
				})
				.catch(err => {});
		},
		onSelect(e) {
			console.log('onSelect', e.currentTarget.dataset.id);
			let address_id = e.currentTarget.dataset.id;
			this.setDefAddress(address_id);
		},
		onAddEdit(e) {
			console.log('onAddEdit', e.currentTarget.dataset);
			let type = e.currentTarget.dataset.type;
			let url = `/pages/address/add/add?type=${type}`;
			if (type == 'edit') {
				let item = JSON.stringify(e.currentTarget.dataset.item) || '';
				url = `/pages/address/add/add?type=${type}&item=${item}`;
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f3f3f4;
}
.address {
	padding-top: 20rpx;
	padding-bottom: 200rpx;
}
.address-card {
	display: flex;
	align-items: center;
	padding: 30rpx;
	position: relative;
	margin-bottom: 20rpx;
	background-color: #fff;
	.item-select {
		// width: 100rpx;
		position: absolute;
		right: 0;
		top: 0;
	}
	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.item-edit {
		width: 160rpx;
		height: 100%;
		text-align: center;
	}
}
.add-btn {
	position: fixed;
	bottom: 30rpx;
	left: 50%;
	transform: translate(-50%, 0);
	width: 640rpx;
}
</style>
