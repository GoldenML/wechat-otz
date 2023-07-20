<template>
	<view>
		<uni-list :border="true">
			<uni-list-chat v-for="(value, key) in store.msgs" :key="key" to="/pages/console/chat-item/chat-item"
				:avatar-circle="false" :title="value.nickname" :avatar="value.avatar" :note="value.lastMsg" showSwitch clickable
				link="navigateTo" @click="onClick(value.username)" badge-positon="left"
				:badge-text="store.badges[value.username]" :showBadge="store.badges[value.username]"
				:time="formatTime(value.lastTime)"></uni-list-chat>


			<!-- <uni-list-chat :avatar-circle="true" title="uni-app" avatar="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" note="您收到一条新的消息" time="2020-02-02 20:20" ></uni-list-chat> -->
		</uni-list>
	</view>
</template>

<script setup>
	import {
		computed,
		getCurrentInstance
	} from "vue";
	import {
		userStore
	} from '@/store/userStore';
	import moment from 'moment';
	const {
		proxy
	} = getCurrentInstance()
	const store = userStore()


	const onClick = (username) => {
			console.log('username', username);
		store.updateOperateUsername(username)
		store.badges[username] = 0
	}

	const formatTime = (timestamp) => {
		if (new Date(Number(timestamp)).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
			return moment(Number(timestamp)).format('HH:mm')
		}
		return moment(Number(timestamp)).format('YY/MM/DD')

	}
</script>

<style lang="scss">
</style>