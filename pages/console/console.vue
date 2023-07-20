<template>
	<view>
		<view>
			<TopBar ref="topBarRef" title='OTZ'></TopBar>
		</view>
		<view >
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
		wx.hideHomeButton();
		connectWs()
		let query = wx.createSelectorQuery();
		query.select('.console').boundingClientRect(res => {
			height.value = res.top - 32 - 60
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
	const getUserMsg = async () => {
	  const userInfo = store.userInfo
	  const friendInfos = store.friendInfos
	  const res = await post(ApiPath.USER_GET_MSGS, {
	    sequence: store.sequence
	  })
	  if(res.code === 0) {
	    const newMessage = res.msgs.map(e => {
	      if (e.from_type === 1 && e.to_type === 1) {
	        if (userInfo.username === e.from_username) {
	          return e.to_username
	        }
	        return e.from_username
	      }
	      return e.to_username
	    })
	    const badges = {}
	    Object.keys(store.msgs).forEach(v => {
	      if(newMessage.includes(v) && store.operateUsername !== v) {
	        badges[v] = true
	      }
	    })
	    Object.assign(store.badges, badges)
	    if(res.msgs?.length > 0) {
	      store.updateSequence(Number(res.msgs[res.msgs.length - 1].sequence))
	      const obj = _.cloneDeep(store.msgs) || {}
	      res.msgs.forEach(e => {
	        const {from_type, to_type, from_username,to_username, msg_type, text_msg, client_sequence, sequence, group_id, timestamp} = e
	        if(new Date(Number(timestamp)).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
	          e.formatTime = moment(new Date(Number(timestamp))).format('HH:mm')
	        } else {
	          e.formatTime = moment(new Date(Number(timestamp))).format('YYYY-MM-DD HH:mm')
	        }
	        if (from_type === 1 && to_type === 1) {
	          const friendUsername = userInfo.username === from_username ? to_username : from_username
	          const idx = friendInfos.findIndex(user => user.username === friendUsername)
	          if (idx > -1) {
	            const friend = friendInfos[idx]
	            if(!obj[friendInfos[idx].username]) {
	              obj[friend.username] = {
	                type: 1,
	                nickname: friend.nickname,
	                avatar: friend.avatar,
	                lastMsg: msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : '',
	                username: friend.username,
	                msgList: [e],
	                lastTime: timestamp
	              }
	            } else {
	              obj[friend.username].lastTime = timestamp
	              obj[friend.username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : ''
	              const i = obj[friend.username].msgList.findIndex(v => String(v.client_sequence) === String(client_sequence))
	              if(client_sequence && i > -1) {
	                obj[friend.username].msgList[i].wait = false
	                return
	              }
	              if(obj[friend.username].msgList.findIndex(v => String(v.sequence) === String(sequence)) === -1) {
	                obj[friend.username].msgList.push(e)
	              }
	            }
	          }
	        } else if((from_type === 1 || from_type === 4) && to_type === 2) {
	          const idx = store.groupInfos.findIndex(v => v.group_id === to_username)
	          if (idx > -1) {
	            const groupInfo = store.groupInfos[idx]
	            if(!obj[to_username]) {
								console.log(1111112222);
	              obj[to_username] = {
	                type: 2,
	                nickname: groupInfo.group_name,
	                avatar: groupInfo.group_avatar,
	                lastUsername: from_username,
	                lastMsg:msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : '',
	                username: to_username,
	                msgList: from_type === 4 ? [
	                  {
	                    ...e,
	                    isSystemMsg: true,
	                  }] : [e],
	                lastTime: timestamp
	              }
	            } else {
	              obj[to_username].lastTime = timestamp
	              obj[to_username].lastUsername = from_username
	              obj[to_username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : ''
	              const i = obj[to_username].msgList.findIndex(v => String(v.client_sequence) === String(client_sequence))
	              if(client_sequence && i > -1) {
	                obj[to_username].msgList[i].formatTime = e.formatTime
	                obj[to_username].msgList[i].wait = false
	                return
	              }
	              if(obj[to_username].msgList.findIndex(v => String(v.sequence) === String(sequence)) === -1) {
	                obj[to_username].msgList.push(from_type === 4 ? {
	                  ...e, isSystemMsg: true,
	                } : e)
	              }
	            }
	          }
	        }
	      })
	      const arr = []
	      Object.keys(obj).forEach((e, i) => {
	        arr[i] = {
	          [e]: obj[e]
	        }
	      })
	      const newArr = arr.sort((v1, v2) => {
	        return Number(v2[Object.keys(v2)[0]].lastTime) - Number(v1[Object.keys(v1)[0]].lastTime)
	      })
	      const newObj = {}
	      newArr.forEach(e => {
	        newObj[Object.keys(e)[0]] = e[Object.keys(e)[0]]
	      })
	      Object.keys(newObj).forEach(v => {
	        if(newObj[v].type === 2) {
	          newObj[v].msgList.filter(e => e.from_type !== 4).forEach(e => {
	            if(!store.groupMember[e.to_username]?.[e.from_username] && !store.cacheUser[e.from_username] && e.from_username) {
	              post(ApiPath.USER_GET_INFO, {
	                username: e.from_username
	              }).then(res => {
	                if (res.code === 0) {
	                  store.cacheUser[res.user_info.username] = res.user_info
	                }
	              })
	            }
	          })
	        }
	      })
	      console.log(newArr)
	      store.updateMsgs(newObj)
	      if(res.msgs.length > 100) {
	        getUserMsg()
	      }
	
	    }
	  }
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