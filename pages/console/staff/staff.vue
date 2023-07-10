<template>
	<view>
		<view style="line-height: 20px; font-size: 14px;">
			全部好友
		</view>
		<uni-list :border="true">
			<uni-list-chat v-for="(item, index) in proxy.$store.state.friendInfos" :key="index" :avatar-circle="true" :title="item.nickname"
				:avatar="item.avatar"  showSwitch clickable
				></uni-list-chat>
			<!-- <uni-list-chat :avatar-circle="true" title="uni-app" avatar="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" note="您收到一条新的消息" time="2020-02-02 20:20" ></uni-list-chat> -->
		</uni-list>
	</view>
</template>

<script setup>
	import {
		getCurrentInstance, onMounted
	} from "vue";
	const {
		proxy
	} = getCurrentInstance()
	onMounted(() => {
		console.log(proxy.$store.state.friendInfos);
	})
</script>

<style>
</style>