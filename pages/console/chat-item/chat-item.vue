<template>
	<view class="chat-item">
		<view class="container">
			<uni-nav-bar dark :fixed="true" color="#000000" shadow background-color="rgb(245, 245, 245)" left-icon="left"
				left-text="返回" :border="false" :height="60" :title="msgs[operateUsername]?.nickname" @clickLeft="back" />
		</view>
		<scroll-view class="chat-content" :scroll-into-view="toView" :style="{height: height + 'px'}" scroll-y="true">
			<view id="scroll-top"></view>
			<view v-if="msgs[operateUsername]?.type === 1">
				<view v-for="msg in msgs[operateUsername].msgList" :key="msg.sequence" :id="msg.sequence">
					<view v-if="msg.from_username === msgs[operateUsername].username">
						<view style="text-align: center; font-size: 12px;color: rgb(168,166,166); padding-top: 5px;">
							{{ msg.formatTime }}
						</view>
						<view class="chat-content-left">
							<image alt=""
								style="float:left;vertical-align: middle; cursor: pointer; width: 32px; height: 32px; border-radius: 16px;"
								:src="msgs[operateUsername].avatar" :width="32" :height="32"
								@click.stop="handleShowInfo($event, false)">
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
								:src="userInfo.avatar" :width="32" :height="32" @click.stop="handleShowInfo($event, true)"></image>
						</view>
					</view>
				</view>
			</view>
			<view v-else-if="msgs[operateUsername]?.type === 2">
				<view v-for="msg in msgs[operateUsername].msgList" :key="msg.sequence">
					<view v-if="msg.isSystemMsg">
						<view style="text-align: center; font-size: 12px;color: rgb(198, 173, 173)">
							<view style="text-align: center; font-size: 12px;color: rgb(168,166,166);padding-top: 5px;">
								{{ msg.formatTime }}
							</view>
							{{ msg.text_msg?.text }}
						</view>
					</view>
					<view v-else-if="msg.from_username === userInfo.username">
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
							
							<image alt=""
								style="float:right;vertical-align: middle; cursor: pointer; width: 32px; height: 32px; border-radius: 16px;"
								:src="userInfo.avatar" :width="32" :height="32" @click.stop="handleShowInfo($event, false)">
							</image>
						</view>
					</view>
					<view v-else>
						<view style="text-align: center; font-size: 12px;color: rgb(168,166,166)"> {{ msg.formatTime }}</view>
						<view class="chat-content-left">
							<image alt="" style="float:left;vertical-align: middle; cursor: pointer;width: 32px;height: 32px"
								:src="groupMember[operateUsername][msg.from_username] ? groupMember[operateUsername][msg.from_username].avatar : cacheUser[msg.from_username]?.avatar"
								@click.stop="handleShowInfo($event, false, true, msg.from_username)"></image>
							<view style="font-size: 12px; margin-left: 38px;position:relative; top: -8px;color: rgb(184, 184, 184)">
								{{ groupMember[operateUsername][msg.from_username] ? groupMember[operateUsername][msg.from_username].nickname : cacheUser[msg.from_username]?.nickname }}
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

	const {
		proxy
	} = getCurrentInstance()
	const message = ref('')
	const back = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const msgs = computed(() => proxy.$store.state.msgs)
	const operateUsername = computed(() => proxy.$store.state.operateUsername)
	const userInfo = computed(() => proxy.$store.state.userInfo)
	const groupMember = computed(() => proxy.$store.state.groupMember)
	const cacheUser = computed(() => proxy.$store.state.cacheUser)

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
		console.log(operateUsername.value)
		proxy.$nextTick(() => {
			let query = wx.createSelectorQuery();
			query.select('.container').boundingClientRect(res => {
				containerHeight.value = res.height
			}).exec();
			query.select('.chat-input').boundingClientRect(res => {
				height.value = Number(Number(res.top - containerHeight.value).toFixed(0))
			}).exec();
			scrollBottom()

			// let view_id = 'view_id_' + parseInt(Math.random() * 1000000)
			// toView.value = ''
			// endId.value = view_id
			// toView.value = view_id
		})
	})
	watch(() => msgs.value[operateUsername.value], (value) =>{
		scrollBottom()
	})
	const handleShowInfo = () => {

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
		console.log(operateUsername.value);
		const client_sequence = userInfo.value.username + new Date().getTime()
		const data = {
			msg_type: 1,
			from_type: 1,
			to_type: msgs.value[operateUsername.value].type,
			to_username: operateUsername.value,
			text_msg: {
				text: message.value
			},
			from_username: userInfo.value.username,
			wait: true,
			client_sequence,
			formatTime: formatDate(new Date().getTime())
		}
		msgs.value[operateUsername.value].lastUsername = userInfo.value.username
		msgs.value[operateUsername.value].lastMsg = message.value
		msgs.value[operateUsername.value].msgList.push(data)
		message.value = ''
		scrollBottom()
		post(ApiPath.USER_SEND_MSG, {
			msg: data
		}, {}, {
			hideToast: true
		}).then(res => {
			globalFunc.getUserMsg()
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

<style lang="scss">
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
</style>