<template>
	<view class="project-detail">
		项目详情
		<submit-bar btnText="提交订单" pirce="800元" shop=""></submit-bar>
	</view>
</template>

<script>
	import submitBar from '../../components/submit-bar.vue'
	export default {
		components: {
			"submit-bar" : submitBar
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss">
	
</style>
