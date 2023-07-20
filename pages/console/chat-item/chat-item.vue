<template>
	<view class="chat-item">
		<view class="container">
			<TopBar background-color="rgb(245, 245, 245)" left-icon="left"
				:title="store.msgs[store.operateUsername]?.nickname" @back="back"></TopBar>
		</view>
		<scroll-view class="chat-content" :scroll-into-view="toView" :style="{height: height + 'px'}" scroll-y="true">
			<view id="scroll-top"></view>
			<view v-if="store.msgs[store.operateUsername]?.type === 1">
				<view v-for="msg in store.msgs[store.operateUsername].msgList" :key="msg.sequence" :id="msg.sequence">
					<view v-if="msg.from_username === store.msgs[store.operateUsername].username">
						<view style="text-align: center; font-size: 12px;color: rgb(168,166,166); padding-top: 5px;">
							{{ msg.formatTime }}
						</view>
						<view class="chat-content-left">
							<image alt="" style="float:left;vertical-align: middle; cursor: pointer; width: 32px; height: 32px;"
								:src="store.msgs[store.operateUsername].avatar" :width="32" :height="32"
								@click.stop="handleShowInfo(1, store.operateUsername)">
							</image>
							<view v-if="msg.msg_type === 2" class="chat-content-left__img">
								<image mode="widthFix" style="width: 150px" :src="msg.image_msg.image_url" alt=""></image>
							</view>
							<view v-else class="chat-content-left__box">
								{{ msg.text_msg?.text }}
							</view>
							<uni-icons v-if="msg.wait" type="spinner-cycle" size="20"></uni-icons>
						</view>
					</view>
					<view v-else>
						<view style="text-align: center; font-size: 12px;color: rgb(168,166,166);padding-top: 5px;">
							{{ msg.formatTime }}
						</view>
						<view class="chat-content-right">
							<uni-icons v-if="msg.wait" type="spinner-cycle" size="20"></uni-icons>
							<view v-if="msg.msg_type === 2" class="chat-content-right__img">
								<image mode="widthFix" style="width: 150px;" :src="msg.image_msg.image_url" alt=""></image>
							</view>
							<view v-else class="chat-content-right__box">
								{{ msg.text_msg?.text }}
							</view>
							<image alt="" style="float: right; vertical-align: middle; cursor: pointer;width: 32px; height: 32px;"
								:src="store.userInfo.avatar" :width="32" :height="32" @click.stop="handleShowInfo"></image>
						</view>
					</view>
				</view>
			</view>
			<view v-else-if="store.msgs[store.operateUsername]?.type === 2">
				<view v-for="msg in store.msgs[store.operateUsername].msgList" :key="msg.sequence">
					<view v-if="msg.isSystemMsg">
						<view style="text-align: center; font-size: 12px;color: rgb(198, 173, 173)">
							<view style="text-align: center; font-size: 12px;color: rgb(168,166,166);padding-top: 5px;">
								{{ msg.formatTime }}
							</view>
							{{ msg.text_msg?.text }}
						</view>
					</view>
					<view v-else-if="msg.from_username === store.userInfo.username">
						<view style="text-align: center; font-size: 12px;color: rgb(168,166,166);padding-top: 5px;">
							{{ msg.formatTime }}
						</view>
						<view class="chat-content-right">
							<uni-icons v-if="msg.wait" type="spinner-cycle" size="20"></uni-icons>
							<view v-if="msg.msg_type === 2" class="chat-content-right__img">
								<image mode="widthFix" style="width: 150px" :src="msg.image_msg.image_url" alt=""></image>
							</view>
							<view v-else class="chat-content-right__box">
								{{ msg.text_msg?.text }}
							</view>
		
							<image alt="" style="float:right;vertical-align: middle; cursor: pointer; width: 32px; height: 32px;"
								:src="store.userInfo.avatar" :width="32" :height="32" @click.stop="handleShowInfo">
							</image>
						</view>
					</view>
					<view v-else>
						<view style="text-align: center; font-size: 12px;color: rgb(168,166,166)"> {{ msg.formatTime }}</view>
						<view class="chat-content-left">
							<image alt="" style="float:left;vertical-align: middle; cursor: pointer;width: 32px;height: 32px"
								:src="store.groupMember[store.operateUsername][msg.from_username] ? store.groupMember[store.operateUsername][msg.from_username].avatar : store.cacheUser[msg.from_username]?.avatar"
								@click.stop="handleShowInfo(2, msg.from_username)"></image>
							<view style="font-size: 12px; margin-left: 38px;position:relative; top: -8px;color: rgb(184, 184, 184)">
								{{ store.groupMember[store.operateUsername][msg.from_username] ? store.groupMember[store.operateUsername][msg.from_username].nickname : store.cacheUser[msg.from_username]?.nickname }}
							</view>
							<view v-if="msg.msg_type === 2" class="chat-content-left__img">
								<image mode="widthFix" style="width: 150px" :src="msg.image_msg.image_url" alt=""></image>
							</view>
							<view v-else class="chat-content-left__box">
								{{ msg.text_msg?.text }}
							</view>
							<uni-icons v-if="msg.wait" type="spinner-cycle" size="20"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			<view id="scroll-bottom"></view>
		</scroll-view>
		<view class="message-bottom"></view>
		<!-- <button @click="testClick">测试</button> -->
		<view class="chat-input">
			<view style="width: 70%; margin-left: 15px;display: inline-block; vertical-align: middle;">
				<uni-easyinput autoHeight v-model="message"></uni-easyinput>
			</view>
			<view style="width: 20%;display: inline-block;vertical-align: middle;margin-left: 5px;">
				<button :disabled="!message" @click="sendMessage" style="line-height: 36px; font-size: 14px;">发送</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		getCurrentInstance,
		inject,
		onMounted,
		ref,
		watch
	} from "vue";
	import loginVue from "../../login/login.vue";
	import {
		post
	} from '@/utils/request.js'
	import ApiPath from '@/common/ApiPath.js'
	import {
		userStore
	} from "@/store/userStore";
	import TopBar from '@/components/TopBar.vue'
	const {
		proxy
	} = getCurrentInstance()
	const message = ref('')
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const store = userStore()


	const toView = ref('')
	const endId = ref('')
	const height = ref(0)

	const footer = ref(null)
	const pageHeight = ref(0)

	const containerHeight = ref(0)
	const footerHeight = ref(0)
	const scrollTop = ref(0)
	const testClick = () => {
		console.log('offsetHeight', footer.$el, proxy.$refs.footer);
	}
	onMounted(() => {
		console.log('type=====>', store.msgs[store.operateUsername]?.type);
		proxy.$nextTick(() => {
			let query = wx.createSelectorQuery();
			query.select('.container').boundingClientRect(res => {
				containerHeight.value = res.height
			}).exec();
			query.select('.chat-input').boundingClientRect(res => {
				height.value = Number(Number(res.top - 32 - containerHeight.value).toFixed(0))
			}).exec();
			scrollBottom()
		})
	})
	watch(() => store.msgs[store.operateUsername], (value) => {
		scrollBottom()
	})
	const handleShowInfo = (type, username) => {
		console.log(77777, type, username);
		if (!username) {
			store.updateLookUserInfo(store.userInfo)
		} else if (type === 1) {
			const idx = store.friendInfos.findIndex(e => e.username === store.operateUsername)
			store.updateLookUserInfo(store.friendInfos[idx])
		} else if (type === 2) {
			store.updateLookUserInfo(store.groupMember[store.operateUsername][username])
		}

		uni.navigateTo({
			url: '/pages/console/user-info/user-info'
		})
	}
	const scrollBottom = () => {
		toView.value = ''
		proxy.$nextTick(() => {
			toView.value = 'scroll-bottom'
		})
	}
	const formatDate = (value, type) => {
		var date = new Date(Number(value));
		var month = date.getMonth() + 1;
		var hours = date.getHours();
		if (hours < 10)
			hours = "0" + hours;
		var minutes = date.getMinutes();
		if (minutes < 10)
			minutes = "0" + minutes;
		return hours + ":" + minutes
	}
	const globalFunc = inject('globalFunc')
	const sendMessage = () => {
		const msg = message.value
		const client_sequence = store.userInfo.username + new Date().getTime()
		const data = {
			msg_type: 1,
			from_type: 1,
			to_type: store.msgs[store.operateUsername].type,
			to_username: store.operateUsername,
			text_msg: {
				text: message.value
			},
			from_username: store.userInfo.username,
			wait: true,
			client_sequence,
			formatTime: formatDate(new Date().getTime())
		}
		store.msgs[store.operateUsername].lastUsername = store.userInfo.username
		store.msgs[store.operateUsername].lastMsg = message.value
		store.msgs[store.operateUsername].msgList.push(data)
		message.value = ''
		scrollBottom()
		post(ApiPath.USER_SEND_MSG, {
			msg: data
		}, {}, {
			hideToast: true
		}).then(res => {
			scrollBottom()
			// globalFunc.getUserMsg()
			// wx.showToast({

			// })
			// if (res.code === 0) {
			// 	globalFunc.getUserMsg()
			// } else {
			// 	proxy.$message({
			// 		type: 'error',
			// 		message: res.msg
			// 	})
			// }
		})
	}
</script>

<style lang="scss" scoped>
	.chat-item {
		height: 100vh;
		background-color: rgb(245, 245, 245);
	}

	.chat-content {
		overflow-y: auto;
		background-color: rgb(245, 245, 245);
		height: calc(100vh - 100px);

		&-left {
			margin-top: 10px;
			margin-left: 20px;
			padding-bottom: 10px;

			&__img {
				text-align: left;
				display: inline-block;
				line-height: 32px;
				min-height: 32px;
				margin-left: 5px;
				padding: 0 10px;
				border-radius: 5px;
				font-size: 14px;
				white-space: pre-wrap;
			}

			&__box {
				max-width: 250px;
				text-align: left;
				display: inline-block;
				line-height: 32px;
				min-height: 32px;
				background-color: rgb(255, 255, 255);
				margin-left: 5px;
				padding: 0 10px;
				border-radius: 5px;
				font-size: 14px;
				white-space: pre-wrap;
			}
		}

		&-right {
			text-align: right;
			margin-top: 10px;
			margin-right: 20px;
			padding-bottom: 10px;

			&__img {
				text-align: left;
				display: inline-block;
				line-height: 32px;
				min-height: 32px;
				margin-right: 5px;
				padding: 0 10px;
				border-radius: 5px;
				font-size: 14px;
				white-space: pre-wrap;
			}

			&__box {
				max-width: 250px;
				text-align: left;
				display: inline-block;
				line-height: 32px;
				min-height: 32px;
				margin-right: 5px;
				background-color: rgb(149, 236, 105);
				padding: 0 10px;
				border-radius: 5px;
				font-size: 14px;
				white-space: pre-wrap;
			}
		}
	}

	.chat-input {
		border-top: 1px solid lightgray;
		background-color: rgb(245, 245, 245);
		// display: flex;
		position: fixed;
		bottom: 0;
		padding-top: 10px;
		padding-bottom: 40px;
		width: 100%;
	}

	$nav-height: 30px;

	.box-bg {
		background-color: #F5F5F5;
		padding: 5px 0;
	}

	.city {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		// width: 160rpx;
		margin-left: 4px;
	}

	.input-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		// width: 500rpx;
		flex: 1;
		background-color: #f8f8f8;
		height: $nav-height;
		border-radius: 15px;
		padding: 0 15px;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: $nav-height;
	}

	.input-uni-icon {
		line-height: $nav-height;
	}

	.nav-bar-input {
		height: $nav-height;
		line-height: $nav-height;
		/* #ifdef APP-PLUS-NVUE */
		width: 370rpx;
		/* #endif */
		padding: 0 5px;
		font-size: 12px;
		background-color: #f8f8f8;
	}

	:deep .uni-navbar--shadow {
		box-shadow: 0 1px 0px #ccc !important;
	}
</style>