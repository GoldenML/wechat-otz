<template>
	<view class="mine">
		<view class="mine-header">
			<image @click="jumpUserInfo" class="mine-header__avatar" :src="store.userInfo.avatar"></image>
			<view class="mine-header__desc">
				<view class="mine-header__desc-nickname">{{store.userInfo.nickname}}</view>
				<view class="mine-header__desc-username">otz号: {{store.userInfo.username}}</view>
			</view>
		</view>
		<view class="mine-divider"></view>
		<view>
			<u--input
			    placeholder="请输入内容"
			    border="surround"
			    v-model="value"
			    @change="change"
			  ></u--input>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		getCurrentInstance
	} from "vue";
	import {userStore} from '@/store/userStore.js'
	const {
		proxy
	} = getCurrentInstance()
	const store = userStore()
	const jumpUserInfo = () => {
		// uni.navigateTo({
		// 	url: '/pages/console/user-info/user-info'
		// })
	}
</script>

<style lang="scss" scoped>
	.mine {
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

		&-divider {
			height: 10px;
			background-color: #cbcbcb;
		}
	}
</style>