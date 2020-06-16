<template>
	<view class="shop">
		<block v-for="item in shopData" :key="item.store_id"><shop-list @onCall="onCall" @onSelect="onSelect" :shop="item"></shop-list></block>
		<van-action-sheet @close="onClose" @cancel="onClose" @select="onSelectPhone" :show="show" :actions="actions" cancel-text="取消" />
	</view>
</template>

<script>
import shopList from '../../components/custom/shop-list.vue';
import { getSupportStore, updateDefaultStore } from '../../interface/mine.js';
export default {
	data() {
		return {
			show: false,
			actions: [],
			shopData: []
		};
	},
	components: {
		'shop-list': shopList
	},
	computed: {
		state() {
			return this.$store.state;
		}
	},
	onLoad() {
		this.goCheckShop();
	},
	methods: {
		onCall(e) {
			this.actions[0] = { name: e };
			this.show = true;
		},
		onClose() {
			this.show = false;
		},
		onSelectPhone(e) {
			if (e.detail && e.detail.name) {
				uni.makePhoneCall({
					phoneNumber: e.detail.name
				});
			}
		},
		onSelect(store_id) {
			for (let item of this.shopData) {
				item.isSelect = item.store_id == store_id ? true : false;
			}
			this.$store.dispatch('setStoreId', store_id);
			console.log('state', this.state);
			uni.setStorageSync('store_id', store_id);
			// uni.navigateBack({
			//     delta: 1
			// });
		},
		// 选择门店 todo  
		goCheckShop() {
			let params = {
				uuid: '04af35760499c8cd005bbf5727465279',
				store_id: this.$store.state.appInfo.store_id || uni.getStorageSync('store_id')
			};
			getSupportStore(params).then(res => {
				for (let item of res.data) {
					item.isSelect = false;
				}
				this.shopData = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f3f3f4;
}
.shop {
}
</style>
