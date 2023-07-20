import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
  state: () => ({
    friendInfos: [],
    msgs: {},
    userInfo: {},
    operateUsername: '',
    addHistory: [],
    sequence: 0,
    messages: {},
    lookUserInfo: {},
    groupInfos: [],
    groupMember:{},
    chatBadge: false,
    contactBadge: false,
    badges: {},
    cacheUser: {}
  }),
  getters: {

  },
  actions: {
    updateFriendInfos(friendInfos) {
      this.friendInfos = friendInfos
    },
    updateMsgs(msgs) {
      this.msgs = msgs
    },
    updateUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    updateOperateUsername(username) {
      this.operateUsername = username
    },
    updateAddHistory(history) {
      this.addHistory = history
    },
    updateSequence(sequence) {
      this.sequence = sequence
    },
    updateMessages(messages) {
      this.messages = messages
    },
    updateLookUserInfo(userInfo) {
      this.lookUserInfo = userInfo
    },
    updateGroupInfos(groupInfos) {
      this.groupInfos = groupInfos
    },
    updateGroupMember(groupMember) {
      this.groupMember = groupMember
    },
    updateChatBadge(chatBadge) {
      this.chatBadge = chatBadge
    },
    updateContactBadge(contactBadge) {
      this.contactBadge = contactBadge
    },
    updateBadges(badges) {
      this.badges = badges
    },
    updateCacheUser(cacheUser) {
      this.cacheUser = cacheUser
    }
  }
})
