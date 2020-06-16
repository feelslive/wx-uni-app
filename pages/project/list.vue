<template>
	<view class="">
		项目列表
		<view class="content">
			<view class="text-area">
				<view class="title">{{ userName }}</view>
				<view class="title">{{ avatarUrl }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			title: 'Hello'
		};
	},
	computed: {
		...mapState(['avatarUrl', 'login', 'userName'])
	},
	onLoad() {
		console.log('$store', this.$store);
	},

	methods: {
		
	}
};
</script>

<style></style>
