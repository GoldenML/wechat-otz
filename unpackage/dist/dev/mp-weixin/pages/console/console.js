"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_ApiPath = require("../../common/ApiPath.js");
const store_userStore = require("../../store/userStore.js");
require("../../common/operate.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (TopBar + ChatModule + StaffModule + Mine + _easycom_uni_icons)();
}
const ChatModule = () => "./chat/chat.js";
const StaffModule = () => "./staff/staff.js";
const Mine = () => "./mine/mine.js";
const TopBar = () => "../../components/TopBar.js";
const _sfc_main = {
  __name: "console",
  setup(__props) {
    const store = store_userStore.userStore();
    const currentItem = common_vendor.ref("chat");
    const height = common_vendor.ref(0);
    const topBarRef = common_vendor.ref();
    const switchItem = (name) => {
      currentItem.value = name;
    };
    common_vendor.onMounted(() => {
      common_vendor.wx$1.hideHomeButton();
      connectWs();
      let query = common_vendor.wx$1.createSelectorQuery();
      query.select(".console").boundingClientRect((res) => {
        height.value = res.top - 32 - 60;
        console.log(11111, height);
      }).exec();
      Promise.all([
        utils_request.post(common_ApiPath.otz.USER_LOGIN_STATUS, {}).then((res) => {
          store.updateUserInfo(res.user_info);
        }),
        utils_request.post(common_ApiPath.otz.USER_GET_FRIEND, {}).then((res) => {
          store.updateFriendInfos(res.friends);
        }),
        utils_request.post(common_ApiPath.otz.USER_GET_GROUP_LIST, {}).then(async (res) => {
          store.updateGroupInfos(res.groups);
          await getAllGroupMember(res.groups);
        })
      ]).then(() => {
        console.log("userInfo===> ");
        getUserMsg();
      });
    });
    common_vendor.provide("globalFunc", {
      getUserMsg: () => getUserMsg()
    });
    const getAllGroupMember = (groups) => {
      const groupMember = {};
      Promise.all(groups.map((e) => {
        return utils_request.post(common_ApiPath.otz.USER_GROUP_GET_MEMBERS, {
          group_id: e.group_id
        }).then((res) => {
          groupMember[e.group_id] = {};
          res.members.forEach((v) => [
            groupMember[e.group_id][v.username] = v
          ]);
        });
      })).then(() => {
        store.updateGroupMember(groupMember);
      });
    };
    const getUserMsg = async () => {
      var _a;
      const userInfo = store.userInfo;
      const friendInfos = store.friendInfos;
      const res = await utils_request.post(common_ApiPath.otz.USER_GET_MSGS, {
        sequence: store.sequence
      });
      if (res.code === 0) {
        const newMessage = res.msgs.map((e) => {
          if (e.from_type === 1 && e.to_type === 1) {
            if (userInfo.username === e.from_username) {
              return e.to_username;
            }
            return e.from_username;
          }
          return e.to_username;
        });
        const badges = {};
        Object.keys(store.msgs).forEach((v) => {
          if (newMessage.includes(v) && store.operateUsername !== v) {
            badges[v] = true;
          }
        });
        Object.assign(store.badges, badges);
        if (((_a = res.msgs) == null ? void 0 : _a.length) > 0) {
          store.updateSequence(Number(res.msgs[res.msgs.length - 1].sequence));
          const obj = common_vendor._.cloneDeep(store.msgs) || {};
          res.msgs.forEach((e) => {
            const { from_type, to_type, from_username, to_username, msg_type, text_msg, client_sequence, sequence, group_id, timestamp } = e;
            if (new Date(Number(timestamp)).setHours(0, 0, 0, 0) === (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)) {
              e.formatTime = common_vendor.hooks(new Date(Number(timestamp))).format("HH:mm");
            } else {
              e.formatTime = common_vendor.hooks(new Date(Number(timestamp))).format("YYYY-MM-DD HH:mm");
            }
            if (from_type === 1 && to_type === 1) {
              const friendUsername = userInfo.username === from_username ? to_username : from_username;
              const idx = friendInfos.findIndex((user) => user.username === friendUsername);
              if (idx > -1) {
                const friend = friendInfos[idx];
                if (!obj[friendInfos[idx].username]) {
                  obj[friend.username] = {
                    type: 1,
                    nickname: friend.nickname,
                    avatar: friend.avatar,
                    lastMsg: msg_type === 1 ? text_msg.text : msg_type === 2 ? "[图片]" : "",
                    username: friend.username,
                    msgList: [e],
                    lastTime: timestamp
                  };
                } else {
                  obj[friend.username].lastTime = timestamp;
                  obj[friend.username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? "[图片]" : "";
                  const i = obj[friend.username].msgList.findIndex((v) => String(v.client_sequence) === String(client_sequence));
                  if (client_sequence && i > -1) {
                    obj[friend.username].msgList[i].wait = false;
                    return;
                  }
                  if (obj[friend.username].msgList.findIndex((v) => String(v.sequence) === String(sequence)) === -1) {
                    obj[friend.username].msgList.push(e);
                  }
                }
              }
            } else if ((from_type === 1 || from_type === 4) && to_type === 2) {
              const idx = store.groupInfos.findIndex((v) => v.group_id === to_username);
              if (idx > -1) {
                const groupInfo = store.groupInfos[idx];
                if (!obj[to_username]) {
                  console.log(1111112222);
                  obj[to_username] = {
                    type: 2,
                    nickname: groupInfo.group_name,
                    avatar: groupInfo.group_avatar,
                    lastUsername: from_username,
                    lastMsg: msg_type === 1 ? text_msg.text : msg_type === 2 ? "[图片]" : "",
                    username: to_username,
                    msgList: from_type === 4 ? [
                      {
                        ...e,
                        isSystemMsg: true
                      }
                    ] : [e],
                    lastTime: timestamp
                  };
                } else {
                  obj[to_username].lastTime = timestamp;
                  obj[to_username].lastUsername = from_username;
                  obj[to_username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? "[图片]" : "";
                  const i = obj[to_username].msgList.findIndex((v) => String(v.client_sequence) === String(client_sequence));
                  if (client_sequence && i > -1) {
                    obj[to_username].msgList[i].formatTime = e.formatTime;
                    obj[to_username].msgList[i].wait = false;
                    return;
                  }
                  if (obj[to_username].msgList.findIndex((v) => String(v.sequence) === String(sequence)) === -1) {
                    obj[to_username].msgList.push(from_type === 4 ? {
                      ...e,
                      isSystemMsg: true
                    } : e);
                  }
                }
              }
            }
          });
          const arr = [];
          Object.keys(obj).forEach((e, i) => {
            arr[i] = {
              [e]: obj[e]
            };
          });
          const newArr = arr.sort((v1, v2) => {
            return Number(v2[Object.keys(v2)[0]].lastTime) - Number(v1[Object.keys(v1)[0]].lastTime);
          });
          const newObj = {};
          newArr.forEach((e) => {
            newObj[Object.keys(e)[0]] = e[Object.keys(e)[0]];
          });
          Object.keys(newObj).forEach((v) => {
            if (newObj[v].type === 2) {
              newObj[v].msgList.filter((e) => e.from_type !== 4).forEach((e) => {
                var _a2;
                if (!((_a2 = store.groupMember[e.to_username]) == null ? void 0 : _a2[e.from_username]) && !store.cacheUser[e.from_username] && e.from_username) {
                  utils_request.post(common_ApiPath.otz.USER_GET_INFO, {
                    username: e.from_username
                  }).then((res2) => {
                    if (res2.code === 0) {
                      store.cacheUser[res2.user_info.username] = res2.user_info;
                    }
                  });
                }
              });
            }
          });
          console.log(newArr);
          store.updateMsgs(newObj);
          if (res.msgs.length > 100) {
            getUserMsg();
          }
        }
      }
    };
    const connectWs = () => {
      let lockReconnect = false;
      let tt;
      let routes = getCurrentPages();
      let curRoute = routes[routes.length - 1].route;
      let ws;
      let wsUrl = "wss://im.shadowgao.com/otz/im/web_proxy/sync_notify";
      function createWebSocket() {
        try {
          ws = common_vendor.wx$1.connectSocket({
            url: wsUrl,
            header: {
              cookie: common_vendor.wx$1.getStorageSync("cookie")
            }
          });
          init();
        } catch (e) {
          console.log(e);
          reconnect();
        }
      }
      function init() {
        common_vendor.wx$1.onSocketOpen(() => {
          console.log("连接成功");
          heartCheck.start();
        });
        common_vendor.wx$1.onSocketMessage(({
          data
        }) => {
          console.log(data);
          if (data === "otz_pong") {
            heartCheck.start();
            return;
          }
          switch (JSON.parse(data).notify_type) {
            case 1:
              if (curRoute === "pages/console/console" || curRoute === "pages/console/chat-item/chat-item") {
                store.updateContactBadge(true);
              }
              break;
            case 2:
              if (curRoute === "pages/console/staff/staff") {
                store.updateChatBadge(true);
              }
              getUserMsg();
              break;
          }
        });
        common_vendor.wx$1.onSocketClose(() => {
          console.log("ws已关闭");
          reconnect();
        });
        common_vendor.wx$1.onSocketError(() => {
          console.log("ws发生异常");
          reconnect();
        });
      }
      function reconnect(url) {
        if (lockReconnect) {
          return;
        }
        lockReconnect = true;
        tt && clearTimeout(tt);
        tt = setTimeout(function() {
          createWebSocket();
          lockReconnect = false;
        }, 4e3);
      }
      let heartCheck = {
        timeout: 1e4,
        timeoutObj: null,
        serverTimeoutObj: null,
        start: function() {
          let self = this;
          console.log("ws ===>", ws);
          this.timeoutObj && clearTimeout(this.timeoutObj);
          this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
          this.timeoutObj = setTimeout(function() {
            common_vendor.wx$1.sendSocketMessage({
              data: "otz-ping"
            });
            self.serverTimeoutObj = setTimeout(function() {
              common_vendor.wx$1.closeSocket();
            }, self.timeout);
          }, this.timeout);
        }
      };
      createWebSocket();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.sr(topBarRef, "f57bffea-0", {
          "k": "topBarRef"
        }),
        b: common_vendor.p({
          title: "OTZ"
        }),
        c: currentItem.value === "chat"
      }, currentItem.value === "chat" ? {} : {}, {
        d: currentItem.value === "staff"
      }, currentItem.value === "staff" ? {} : {}, {
        e: currentItem.value === "mine"
      }, currentItem.value === "mine" ? {} : {}, {
        f: height.value + "px",
        g: currentItem.value !== "chat"
      }, currentItem.value !== "chat" ? {
        h: common_vendor.p({
          type: "chatbubble",
          size: 30
        })
      } : {
        i: common_vendor.p({
          type: "chatbubble-filled",
          size: 30
        })
      }, {
        j: common_vendor.o(($event) => switchItem("chat")),
        k: currentItem.value !== "staff"
      }, currentItem.value !== "staff" ? {
        l: common_vendor.p({
          type: "staff",
          size: 30
        })
      } : {
        m: common_vendor.p({
          type: "staff-filled",
          size: 30
        })
      }, {
        n: common_vendor.o(($event) => switchItem("staff")),
        o: currentItem.value !== "mine"
      }, currentItem.value !== "mine" ? {
        p: common_vendor.p({
          type: "person",
          size: 30
        })
      } : {
        q: common_vendor.p({
          type: "person-filled",
          size: 30
        })
      }, {
        r: common_vendor.o(($event) => switchItem("mine"))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f57bffea"], ["__file", "D:/workspace/wechat-otz/pages/console/console.vue"]]);
wx.createPage(MiniProgramPage);
