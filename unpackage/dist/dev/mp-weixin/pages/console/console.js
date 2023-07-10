"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_ApiPath = require("../../common/ApiPath.js");
require("../../common/operate.js");
require("../../store/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (ChatModule + StaffModule + _easycom_uni_icons)();
}
const ChatModule = () => "./chat/chat.js";
const StaffModule = () => "./staff/staff.js";
const _sfc_main = {
  __name: "console",
  setup(__props) {
    const {
      proxy
    } = common_vendor.getCurrentInstance();
    const currentItem = common_vendor.ref("chat");
    const switchItem = (name) => {
      currentItem.value = name;
    };
    common_vendor.onMounted(() => {
      Promise.all([
        utils_request.post(common_ApiPath.otz.USER_LOGIN_STATUS, {}).then((res) => {
          proxy.$store.commit("updateUserInfo", res.user_info);
        }),
        utils_request.post(common_ApiPath.otz.USER_GET_FRIEND, {}).then((res) => {
          proxy.$store.commit("updateFriendInfos", res.friends);
        }),
        utils_request.post(common_ApiPath.otz.USER_GET_GROUP_LIST, {}).then(async (res) => {
          proxy.$store.commit("updateGroupInfos", res.groups);
          await getAllGroupMember(res.groups);
        })
      ]).then(() => {
        console.log("userInfo===> ");
        getUserMsg();
      });
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
        proxy.$store.commit("updateGroupMember", groupMember);
      });
    };
    const formatDate = (value, type) => {
      var date = new Date(Number(value));
      var month = date.getMonth() + 1;
      var hours = date.getHours();
      if (hours < 10)
        hours = "0" + hours;
      var minutes = date.getMinutes();
      if (minutes < 10)
        minutes = "0" + minutes;
      if (new Date(Number(value)).setHours(0, 0, 0, 0) === (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)) {
        return hours + ":" + minutes;
      } else {
        return date.getFullYear() + "-" + month + "-" + date.getDate() + " " + hours + ":" + minutes;
      }
    };
    const getUserMsg = async () => {
      var _a;
      const {
        userInfo,
        groupInfos,
        sequence,
        operateUsername,
        msgs,
        friendInfos,
        badges,
        cacheUser,
        groupMember
      } = proxy.$store.state;
      console.log(222, userInfo, friendInfos);
      const res = await utils_request.post(common_ApiPath.otz.USER_GET_MSGS, {
        sequence
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
        const tempBadges = {};
        Object.keys(msgs).forEach((v) => {
          if (newMessage.includes(v) && operateUsername !== v) {
            tempBadges[v] = true;
          }
        });
        Object.assign(badges, tempBadges);
        if (((_a = res.msgs) == null ? void 0 : _a.length) > 0) {
          proxy.$store.commit("updateSequence", Number(res.msgs[res.msgs.length - 1].sequence));
          const obj = proxy.$deepClone(msgs) || {};
          res.msgs.forEach((e) => {
            const {
              from_type,
              to_type,
              from_username,
              to_username,
              msg_type,
              text_msg,
              client_sequence,
              sequence: sequence2,
              group_id,
              timestamp
            } = e;
            e.formatTime = formatDate(timestamp);
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
                    lastTime: formatDate(timestamp)
                  };
                } else {
                  obj[friend.username].lastTime = formatDate(timestamp);
                  obj[friend.username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? "[图片]" : "";
                  const i = obj[friend.username].msgList.findIndex((v) => String(v.client_sequence) === String(
                    client_sequence
                  ));
                  if (client_sequence && i > -1) {
                    obj[friend.username].msgList[i].wait = false;
                    return;
                  }
                  if (obj[friend.username].msgList.findIndex((v) => String(v.sequence) === String(sequence2)) === -1) {
                    obj[friend.username].msgList.push(e);
                  }
                }
              }
            } else if ((from_type === 1 || from_type === 4) && to_type === 2) {
              const idx = groupInfos.findIndex((v) => v.group_id === to_username);
              if (idx > -1) {
                const groupInfo = groupInfos[idx];
                if (!obj[to_username]) {
                  obj[to_username] = {
                    type: 2,
                    nickname: groupInfo.group_name,
                    avatar: groupInfo.group_avatar,
                    lastUsername: from_username,
                    lastMsg: msg_type === 1 ? text_msg.text : msg_type === 2 ? "[图片]" : "",
                    username: group_id,
                    msgList: from_type === 4 ? [{
                      ...e,
                      isSystemMsg: true
                    }] : [e],
                    lastTime: formatDate(timestamp)
                  };
                } else {
                  obj[to_username].lastTime = formatDate(timestamp);
                  obj[to_username].lastUsername = from_username;
                  obj[to_username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? "[图片]" : "";
                  const i = obj[to_username].msgList.findIndex((v) => String(v.client_sequence) === String(
                    client_sequence
                  ));
                  if (client_sequence && i > -1) {
                    obj[to_username].msgList[i].formatTime = e.formatTime;
                    obj[to_username].msgList[i].wait = false;
                    return;
                  }
                  if (obj[to_username].msgList.findIndex((v) => String(v.sequence) === String(sequence2)) === -1) {
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
                if (!((_a2 = groupMember[e.to_username]) == null ? void 0 : _a2[e.from_username]) && !cacheUser[e.from_username] && e.from_username) {
                  utils_request.post(common_ApiPath.otz.USER_GET_INFO, {
                    username: e.from_username
                  }).then((res2) => {
                    if (res2.code === 0) {
                      cacheUser[res2.user_info.username] = res2.user_info;
                    }
                  });
                }
              });
            }
          });
          proxy.$store.commit("updateMsgs", obj);
          getUserMsg();
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentItem.value === "chat"
      }, currentItem.value === "chat" ? {} : {}, {
        b: currentItem.value === "staff"
      }, currentItem.value === "staff" ? {} : {}, {
        c: currentItem.value !== "chat"
      }, currentItem.value !== "chat" ? {
        d: common_vendor.p({
          type: "chatbubble",
          size: 30
        })
      } : {
        e: common_vendor.p({
          type: "chatbubble-filled",
          size: 30
        })
      }, {
        f: common_vendor.o(($event) => switchItem("chat")),
        g: currentItem.value !== "staff"
      }, currentItem.value !== "staff" ? {
        h: common_vendor.p({
          type: "staff",
          size: 30
        })
      } : {
        i: common_vendor.p({
          type: "staff-filled",
          size: 30
        })
      }, {
        j: common_vendor.o(($event) => switchItem("staff")),
        k: currentItem.value !== "my"
      }, currentItem.value !== "my" ? {
        l: common_vendor.p({
          type: "person",
          size: 30
        })
      } : {
        m: common_vendor.p({
          type: "person-filled",
          size: 30
        })
      }, {
        n: common_vendor.o(($event) => switchItem("my"))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/workspace/wechat-otz/pages/console/console.vue"]]);
wx.createPage(MiniProgramPage);
