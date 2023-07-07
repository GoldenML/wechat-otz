<template>
	<view>
		<chat />
	</view>
	<view class="console">
		<view @click="switchItem('chat')" id="chat" class="console-item">
			<uni-icons v-if="currentItem !== 'chat'" type="chatbubble" :size="30"></uni-icons>
			<uni-icons v-else type="chatbubble-filled" :size="30"></uni-icons>
			<view class="console-item__title">聊天</view>
		</view>
			
		<view @click="switchItem('staff')" id="staff" class="console-item">
			<uni-icons v-if="currentItem !== 'staff'" type="staff" :size="30"></uni-icons>
			<uni-icons v-else type="staff-filled" :size="30"></uni-icons>
			<view class="console-item__title">通讯录</view>
		</view>
		<view @click="switchItem('my')" id="my" class="console-item">
			<uni-icons v-if="currentItem !== 'my'" type="person" :size="30"></uni-icons>
			<uni-icons v-else  type="person-filled" :size="30"></uni-icons>
			<view class="console-item__title">我的</view>
		</view>
	</view>
</template>

<script setup>
import chat from './chat/chat.vue'
import { onMounted, ref } from "vue"
import api from '@/common/api.js'

import {
		useStore
	} from 'vuex'
	const currentItem = ref('chat')
const store = useStore()
const switchItem = (name) => {
	currentItem.value = name
}

onMounted(() => {
	Promise.all([
		api.getLoginStatus().then(res => {
			if(res.code === 0) {
				console.log(store.user_info);
				store.updateUserInfo(res.user_info)
			}
		})
	])
})

</script>

<style lang="scss">
.console{
	position: fixed;
	bottom: 40px;
	height: '60px';
	display: flex;
	width: 100%;
	&-item{
		text-align: center;
		width: 33%;
		&__title{
			font-size: 12px
		}
	}
}
</style>
