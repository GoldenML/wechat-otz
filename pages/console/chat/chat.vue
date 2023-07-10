<template>
	<view>
		<uni-list :border="true">
			<uni-list-chat to="/pages/console/chat-item/chat-item" v-for="(value, key) in proxy.$store.state.msgs" :key="key" :avatar-circle="true" :title="value.nickname"
				:avatar="value.avatar" :note="value.lastMsg" showSwitch clickable link="navigateTo" @click="onClick(value.username)"
				:time="value.lastTime"></uni-list-chat>
			<!-- <uni-list-chat :avatar-circle="true" title="uni-app" avatar="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" note="您收到一条新的消息" time="2020-02-02 20:20" ></uni-list-chat> -->
		</uni-list>
	</view>
</template>

<script setup>
	import {
		getCurrentInstance
	} from "vue";

	const {
		proxy
	} = getCurrentInstance()
	
	const onClick = (username) => {
		proxy.$store.commit('updateOperateUsername', username)
	}
</script>

<style>

</style>