import {
	createStore
} from "vuex";
import { reactive } from "vue";

export default createStore({
	state() {
		return reactive({
			friendInfos: [],
			msgs: {},
			userInfo: {},
			operateUsername: '',
			addHistory: [],
			sequence: 0,
			messages: {},
			lookUserInfo: {},
			groupInfos: [],
			groupMember: {},
			chatBadge: false,
			contactBadge: false,
			badges: {},
			cacheUser: {},
			cookie: ''
		})
		
	},
	mutations: {
		updateFriendInfos(state, friendInfos) {
			state.friendInfos = friendInfos
		},
		updateMsgs(state, msgs) {
			state.msgs = msgs
		},
		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
		updateOperateUsername(state, username) {
			state.operateUsername = username
		},
		updateAddHistory(state, history) {
			state.addHistory = history
		},
		updateSequence(state, sequence) {
			state.sequence = sequence
		},
		updateMessages(state, messages) {
			state.messages = messages
		},
		updateLookUserInfo(state, userInfo) {
			state.lookUserInfo = userInfo
		},
		updateGroupInfos(state, groupInfos) {
			state.groupInfos = groupInfos
		},
		updateGroupMember(state, groupMember) {
			state.groupMember = groupMember
		},
		updateChatBadge(state, chatBadge) {
			state.chatBadge = chatBadge
		},
		updateContactBadge(state, contactBadge) {
			state.contactBadge = contactBadge
		},
		updateBadges(state, badges) {
			state.badges = badges
		},
		updateCacheUser(state, cacheUser) {
			state.cacheUser = cacheUser
		},
		updateCookie(state, cookie) {
			state.cookie = cookie
		}
	},
	actions: {},
	getters: {},
	modules: {}
});