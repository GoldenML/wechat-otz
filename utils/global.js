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
	userStore
} from '@/store/userStore';
import _ from 'lodash';
import moment from 'moment';

const store = userStore()
export const getUserMsg = async () => {
	const userInfo = store.userInfo
	const friendInfos = store.friendInfos
	const res = await post(ApiPath.USER_GET_MSGS, {
		sequence: store.sequence
	}, {}, {
		hideToast: true
	})
	if (res.code === 0) {
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
			if (newMessage.includes(v) && store.operateUsername !== v) {
				badges[v] = store.badges[v] ? store.badges[v] < 99 ? ++store.badges[v] : '99+' : 1
			}
		})
		Object.assign(store.badges, badges)
		console.log('xsxsxsss=>', store.badges);
		if (res.msgs?.length > 0) {
			store.updateSequence(Number(res.msgs[res.msgs.length - 1].sequence))
			const obj = _.cloneDeep(store.msgs) || {}
			res.msgs.forEach(e => {
				const {
					from_type,
					to_type,
					from_username,
					to_username,
					msg_type,
					text_msg,
					client_sequence,
					sequence,
					group_id,
					timestamp
				} = e
				if (new Date(Number(timestamp)).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
					e.formatTime = moment(new Date(Number(timestamp))).format('HH:mm')
				} else {
					e.formatTime = moment(new Date(Number(timestamp))).format('YYYY-MM-DD HH:mm')
				}
				if (from_type === 1 && to_type === 1) {
					const friendUsername = userInfo.username === from_username ? to_username : from_username
					const idx = friendInfos.findIndex(user => user.username === friendUsername)
					if (idx > -1) {
						const friend = friendInfos[idx]
						if (!obj[friendInfos[idx].username]) {
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
							const i = obj[friend.username].msgList.findIndex(v => String(v.client_sequence) === String(
								client_sequence))
							if (client_sequence && i > -1) {
								obj[friend.username].msgList[i].wait = false
								return
							}
							if (obj[friend.username].msgList.findIndex(v => String(v.sequence) === String(sequence)) === -
								1) {
								obj[friend.username].msgList.push(e)
							}
						}
					}
				} else if ((from_type === 1 || from_type === 4) && to_type === 2) {
					const idx = store.groupInfos.findIndex(v => v.group_id === to_username)
					if (idx > -1) {
						const groupInfo = store.groupInfos[idx]
						if (!obj[to_username]) {
							console.log(1111112222);
							obj[to_username] = {
								type: 2,
								nickname: groupInfo.group_name,
								avatar: groupInfo.group_avatar,
								lastUsername: from_username,
								lastMsg: msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : '',
								username: to_username,
								msgList: from_type === 4 ? [{
									...e,
									isSystemMsg: true,
								}] : [e],
								lastTime: timestamp
							}
						} else {
							obj[to_username].lastTime = timestamp
							obj[to_username].lastUsername = from_username
							obj[to_username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : ''
							const i = obj[to_username].msgList.findIndex(v => String(v.client_sequence) === String(
								client_sequence))
							if (client_sequence && i > -1) {
								obj[to_username].msgList[i].formatTime = e.formatTime
								obj[to_username].msgList[i].wait = false
								return
							}
							if (obj[to_username].msgList.findIndex(v => String(v.sequence) === String(sequence)) === -1) {
								obj[to_username].msgList.push(from_type === 4 ? {
									...e,
									isSystemMsg: true,
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
				if (newObj[v].type === 2) {
					newObj[v].msgList.filter(e => e.from_type !== 4).forEach(e => {
						if (!store.groupMember[e.to_username]?.[e.from_username] && !store.cacheUser[e
								.from_username] && e.from_username) {
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
			if (res.msgs.length > 100) {
				getUserMsg()
			}

		}
	}
}