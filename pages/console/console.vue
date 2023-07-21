<template>
	<view>
		<view>
			<TopBar ref="topBarRef" title='OTZ'></TopBar>
		</view>
		<view>
			<scroll-view :style="{height: height + 'px'}" scroll-y="true">
				<ChatModule v-if="currentItem === 'chat'" />
				<StaffModule v-if="currentItem === 'staff'" />
				<Mine v-if="currentItem === 'mine'" />
			</scroll-view>
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
				<view @click="switchItem('mine')" id="mine" class="console-item">
					<uni-icons v-if="currentItem !== 'mine'" type="person" :size="30"></uni-icons>
					<uni-icons v-else type="person-filled" :size="30"></uni-icons>
					<view class="console-item__title">我的</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	import ChatModule from '@/pages/console/chat/chat.vue'
	import StaffModule from '@/pages/console/staff/staff.vue'
	import Mine from '@/pages/console/mine/mine.vue'
	import {
		computed,
		getCurrentInstance,
		onMounted,
		provide,
		ref
	} from "vue"
	import {
		post
	} from '@/utils/request';
	import ApiPath from '@/common/ApiPath.js'
	import {
		useStore,
		mapState
	} from 'vuex'
	import {
		userStore
	} from '@/store/userStore';
	import _ from 'lodash';
	import moment from 'moment';
	import TopBar from '@/components/TopBar.vue'
	import {
		getUserMsg
	} from '@/utils/global.js'
	const {
		proxy
	} = getCurrentInstance()
	const store = userStore()
	const currentItem = ref('chat')
	const height = ref(0)
	const topBarRef = ref()
	const switchItem = (name) => {
		currentItem.value = name
	}
	onMounted(() => {
		wx.showShareMenu({
		  withShareTicket: true,
		  menus: ['shareAppMessage', 'shareTimeline']
		})
		wx.hideHomeButton();
		connectWs()
		let query = wx.createSelectorQuery();
		const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
		query.select('.console').boundingClientRect(res => {
			height.value = res.top - menuButtonInfo.height - 60
			console.log(11111, height)
		}).exec();
		Promise.all([
			post(ApiPath.USER_LOGIN_STATUS, {}).then(res => {
				store.updateUserInfo(res.user_info)
			}),
			post(ApiPath.USER_GET_FRIEND, {}).then(res => {
				store.updateFriendInfos(res.friends)
			}),
			post(ApiPath.USER_GET_GROUP_LIST, {}).then(async res => {
				store.updateGroupInfos(res.groups)
				await getAllGroupMember(res.groups)
			})
		]).then(() => {
			console.log('userInfo===> ');
			getUserMsg()
		})
	})
	provide('globalFunc', {
		getUserMsg: () => getUserMsg(),
	})
	const getAllGroupMember = (groups) => {
		const groupMember = {}
		Promise.all(groups.map(e => {
			return post(ApiPath.USER_GROUP_GET_MEMBERS, {
				group_id: e.group_id
			}).then(res => {
				groupMember[e.group_id] = {}
				res.members.forEach(v => [
					groupMember[e.group_id][v.username] = v
				])
			})
		})).then(() => {
			store.updateGroupMember(groupMember)
		})
	}
	const connectWs = () => {
		let lockReconnect = false
		let tt
		let routes = getCurrentPages();
		let curRoute = routes[routes.length - 1].route
		let timer = null
		let ws
		let wsUrl = 'wss://im.shadowgao.com/otz/im/web_proxy/sync_notify'

		function createWebSocket() {
			try {
				ws = wx.connectSocket({
					url: wsUrl,
					header: {
						cookie: wx.getStorageSync('cookie')
					}
				})
				init()
			} catch (e) {
				console.log(e);
				reconnect(wsUrl)
			}
		}

		function init() {
			wx.onSocketOpen(() => {
				console.log('连接成功');
				//心跳检测重置
				heartCheck.start()
			})
			wx.onSocketMessage(({
				data
			}) => {
				console.log(data);
				if (data === 'otz_pong') {
					heartCheck.start()
					return
				}

				switch (JSON.parse(data).notify_type) {
					case 1:
						if (curRoute === 'pages/console/console' || curRoute === 'pages/console/chat-item/chat-item') {
							store.updateContactBadge(true)
						}
						// getAddHistory()
						break
					case 2:
						if (curRoute === 'pages/console/staff/staff') {
							store.updateChatBadge(true)
						}
						getUserMsg()
						break
					default:
						break
				}
			})
			wx.onSocketClose(() => {
				console.log('ws已关闭')
				reconnect(wsUrl)
			})
			wx.onSocketError(() => {
				console.log('ws发生异常')
				reconnect(wsUrl)
			})
		}

		function reconnect(url) {
			if (lockReconnect) {
				return
			}
			lockReconnect = true
			//没连接上会一直重连，设置延迟避免请求过多
			tt && clearTimeout(tt)
			tt = setTimeout(function() {
				createWebSocket(url)
				lockReconnect = false
			}, 4000)
		}
		let heartCheck = {
			timeout: 10000,
			timeoutObj: null,
			serverTimeoutObj: null,
			start: function() {
				let self = this
				console.log('ws ===>', ws)
				this.timeoutObj && clearTimeout(this.timeoutObj)
				this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
				this.timeoutObj = setTimeout(function() {
					//这里发送一个心跳，后端收到后，返回一个心跳消息，
					wx.sendSocketMessage({
						data: 'otz-ping',
					})
					self.serverTimeoutObj = setTimeout(function() {
						wx.closeSocket()
					}, self.timeout)
				}, this.timeout)
			}
		}
		// const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
		// IS_PROD && createWebSocket()
		createWebSocket()
	}
</script>

<style lang="scss" scoped>
	.console {
		position: fixed;
		bottom: 40px;
		height: '60px';
		display: flex;
		width: 100%;

		&-item {
			text-align: center;
			width: 33%;

			&__title {
				font-size: 12px
			}
		}
	}
</style>