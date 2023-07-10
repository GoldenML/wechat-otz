<template>
	<view class="chat-item">
		<view class="container">
			<uni-nav-bar dark :fixed="true" color="#000000" shadow background-color="rgb(245, 245, 245)" left-icon="left"
				left-text="返回" :border="false" :height="60" :title="msgs[operateUsername]?.nickname" @clickLeft="back" />
		</view>
		<scroll-view >
			<view v-if="msgs[operateUsername]?.type === 1">
				<view v-for="msg in msgs[operateUsername].msgList" :key="msg.sequence">
					<view v-if="msg.from_username === msgs[operateUsername].username">
						<view style="text-align: center; font-size: 12px;color: rgb(168,166,166); margin-top: 5px;">
							{{ msg.formatTime }}
						</view>
						<view class="chat-content-left">
							<image alt=""
								style="float:left;vertical-align: middle; cursor: pointer; width: 32px; height: 32px; border-radius: 16px;"
								:src="msgs[operateUsername].avatar" :width="32" :height="32"
								@click.stop="handleShowInfo($event, false)">
							</image>
							<view v-if="msg.msg_type === 2" class="chat-content-left__img">
								<image :width="300" :src="msg.image_msg.image_url" alt=""></image>
							</view>
							<view v-else class="chat-content-left__box">
								{{ msg.text_msg?.text }}
							</view>
						</view>
					</view>
					<view v-else>
						<view style="text-align: center; font-size: 12px;color: rgb(168,166,166)"> {{ msg.formatTime }}</view>
						<view class="chat-content-right">
							<view v-if="msg.msg_type === 2" class="chat-content-right__img">
								<image :width="300" :src="msg.image_msg.image_url" alt=""></image>
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

			</view>
		</scroll-view>
		<view class="chat-input" ref="footer">
			<view style="width: 70%;margin-left: 20px;">
				<uni-easyinput autoHeight v-model="message" placeholder="请输入内容"></uni-easyinput>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		getCurrentInstance,
		onMounted,
		ref
	} from "vue";
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
	const height = ref(0)
	const footerHeight = ref(0)
	const footer = ref(null)
	const pageHeight = ref(0)
	const keyBoardHeight = ref(0)
	onMounted(() => {
		 proxy.$nextTick(() => {
			 console.log('offsetHeight', footer);
		 })
		
		// uni.getSystemInfo({
		// 	success: (res) => {
		// 		pageHeight.value = res.windowHeight - res.statusBarHeight - 60
		// 	}
		// })
		// proxy.$nextTick(() => {
		// 	// #ifdef H5
		// 	footerHeight.value = footer.$el.offsetHeight
		// 	height.value = this.pageHeight - this.footerHeight
		// 	// #endif
		// 	// #ifdef APP-PLUS
		// 	uni.createSelectorQuery().in(this).select("#footer").boundingClientRect((data) => {
		// 		this.footerHeight = data.height
		// 		this.height = this.pageHeight - this.footerHeight
		// 	}).exec()
		// 	// #endif
		// })
		// uni.onKeyboardHeightChange(res => {
		// 	let h = res.height
		// 	if (keyBoardHeight.value == 0 && h > 0) {
		// 		keyBoardHeight.value = h
		// 	}
		// 	if (height.value > 0) {
		// 		height.value = ht - keyBoardHeight.value
		// 	} else {
		// 		height.value = h + keyBoardHeight.value
		// 	}
		// })
	})
	const handleShowInfo = () => {

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
			margin-left: 30px;
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
				max-width: 500px;
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
			margin-right: 30px;
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
				max-width: 500px;
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