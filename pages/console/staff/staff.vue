<template>
	<view>
		<view style="line-height: 30px; font-size: 14px;margin-left: 10px;">
			全部群聊
		</view>
		<uni-list :border="true">
			<uni-list-chat v-for="(item, index) in store.groupInfos" :key="index" :avatar-circle="true"
				@click="sendGroupMessage(item)" :title="item.group_name" :avatar="item.group_avatar" showSwitch
				clickable></uni-list-chat>
			<!-- <uni-list-chat :avatar-circle="true" title="uni-app" avatar="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" note="您收到一条新的消息" time="2020-02-02 20:20" ></uni-list-chat> -->
		</uni-list>
		<view style="line-height: 30px; font-size: 14px;margin-left: 10px;">
			全部好友
		</view>
		<uni-list :border="true">
			<uni-list-chat v-for="(item, index) in store.friendInfos" :key="index" :avatar-circle="true"
				to="/pages/console/user-info/user-info" link="navigateTo" @click="onClick(item)" :title="item.nickname"
				:avatar="item.avatar" showSwitch clickable></uni-list-chat>
			<!-- <uni-list-chat :avatar-circle="true" title="uni-app" avatar="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png" note="您收到一条新的消息" time="2020-02-02 20:20" ></uni-list-chat> -->
		</uni-list>
	</view>
</template>

<script setup>
	import {
		getCurrentInstance,
		onMounted
	} from "vue";
	import {
		userStore
	} from '@/store/userStore.js'
	const {
		proxy
	} = getCurrentInstance()
	const store = userStore()
	onMounted(() => {})
	const onClick = (userInfo) => {
		store.updateLookUserInfo(userInfo)
	}
	const sendGroupMessage = (item) => {
		const idx = store.groupInfos.findIndex(e => e.group_id === item.group_id)
		if (!store.msgs[item.group_id]) {
			store.msgs[item.group_id] = {
				type: 2,
				nickname: store.groupInfos[idx].group_name,
				avatar: store.groupInfos[idx].group_avatar,
				lastUsername: '',
				lastMsg: '',
				username: item.group_id,
				msgList: [],
			}
		}
		store.updateOperateUsername(item.group_id)
		uni.navigateTo({
			url: '/pages/console/chat-item/chat-item'
		})
	}
</script>

<style lang="scss" scoped>
	.staff {
		max-height: calc(100vh - 400px);
	}
</style>