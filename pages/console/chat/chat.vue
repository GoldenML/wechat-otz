<template>
	<view>
		<uni-list :border="true">
			<uni-list-chat v-for="(value, key) in proxy.$store.state.msgs" :key="key" to="/pages/console/chat-item/chat-item" :avatar-circle="false" :title="value.nickname"
				:avatar="value.avatar" :note="value.lastMsg" showSwitch clickable link="navigateTo" @click="onClick(value.username)" badge-positon="left" :badge-text="badges[value.username]" :showBadge="badges[value.username]"
				:time="value.lastTime"></uni-list-chat>

			
			<!-- <uni-list-chat :avatar-circle="true" title="uni-app" avatar="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" note="您收到一条新的消息" time="2020-02-02 20:20" ></uni-list-chat> -->
		</uni-list>
	</view>
</template>

<script setup>
	import {
		computed,
		getCurrentInstance
	} from "vue";

	const {
		proxy
	} = getCurrentInstance()
	
	const badges = computed(() => proxy.$store.state.badges)
	
	const onClick = (username) => {
		proxy.$store.commit('updateOperateUsername', username)
		badges.value[username] = 0
		console.log(badges);
		proxy.$store.commit('updateBadges', badges.value)
	}
</script>

<style lang="scss">
</style>