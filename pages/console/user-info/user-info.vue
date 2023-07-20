<template>
	<view class="user-info">
		<TopBar leftIcon="left" @back="back"></TopBar>
		<view class="user-info-header">
			<image @click="jumpUserInfo" class="user-info-header__avatar" :src="store.lookUserInfo.avatar"></image>
			<view class="user-info-header__desc">
				<view class="user-info-header__desc-nickname">{{store.lookUserInfo.nickname}}</view>
				<view class="user-info-header__desc-username">otz号: {{store.lookUserInfo.username}}</view>
				<view class="user-info-header__desc-username">地区: {{area}}</view>
			</view>
		</view>

		<view class="user-info-content">
			<button @click="sendMessage" class="user-info-content__button">发消息</button>
		</view>
	</view>
</template>

<script setup>
	import TopBar from '@/components/TopBar.vue'
	import {
		computed,
		onMounted,
		ref
	} from "vue";
	import {
		userStore
	} from '@/store/userStore';
	import {
		codeToText
	} from 'element-china-area-data'
	const store = userStore()
	const area = computed(() => {
		return codeToText[store.lookUserInfo.province] && codeToText[store.lookUserInfo.city] && codeToText[store
				.lookUserInfo.district] ?
			`${codeToText[store.lookUserInfo.province]}/${codeToText[store.lookUserInfo.city]}/${codeToText[store.lookUserInfo.district]}` :
			''
	})
	onMounted(() => {
		wx.hideHomeButton();
	})
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	const sendMessage = () => {
		if (store.operateUsername === store.lookUserInfo.username) {
			uni.navigateBack({
				delta: 1
			})
			return
		}
		uni.navigateTo({
			url: '/pages/console/chat-item/chat-item'
		})
		const username = store.lookUserInfo.username
		store.updateOperateUsername(username)
		store.badges[username] = 0
	}
</script>

<style lang="scss" scoped>
	.user-info {
		&-header {
			padding: 40px 20px;
			display: flex;

			&__avatar {
				width: 60px;
				height: 60px;
			}

			&__desc {
				margin-left: 20px;

				&-username {
					margin-top: 8px;
					font-size: 14px;
					color: #999;
				}
			}
		}

		&-content {
			&__button {
				font-size: 14px;
				color: #2385f1;
			}
		}
	}
</style>