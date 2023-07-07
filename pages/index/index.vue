<template>
	<view class="container">
		
		<view class="intro">本项目已包含uni ui组件，无需import和注册，可直接使用。在代码区键入字母u，即可通过代码助手列出所有可用组件。光标置于组件名称处按F1，即可查看组件。</view>
		<text class="intro">详见：</text>
		<uni-easyinput type="textarea" v-model="value" placeholder="请输入"></uni-easyinput>
		
		<uni-badge>
			<uni-link :href="href" :text="href"></uni-link>
		</uni-badge>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui',
				value: ''
			}
		},
		methods: {

		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
