"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_userStore = require("../../../store/userStore.js");
if (!Array) {
  const _easycom_uni_list_chat2 = common_vendor.resolveComponent("uni-list-chat");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  (_easycom_uni_list_chat2 + _easycom_uni_list2)();
}
const _easycom_uni_list_chat = () => "../../../uni_modules/uni-list/components/uni-list-chat/uni-list-chat.js";
const _easycom_uni_list = () => "../../../uni_modules/uni-list/components/uni-list/uni-list.js";
if (!Math) {
  (_easycom_uni_list_chat + _easycom_uni_list)();
}
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const store = store_userStore.userStore();
    const onClick = (username) => {
      console.log("username", username);
      store.updateOperateUsername(username);
      store.badges[username] = 0;
    };
    const formatTime = (timestamp) => {
      if (new Date(Number(timestamp)).setHours(0, 0, 0, 0) === (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)) {
        return common_vendor.hooks(Number(timestamp)).format("HH:mm");
      }
      return common_vendor.hooks(Number(timestamp)).format("YY/MM/DD");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(store).msgs, (value, key, i0) => {
          return {
            a: key,
            b: common_vendor.o(($event) => onClick(value.username), key),
            c: "6341fca0-1-" + i0 + ",6341fca0-0",
            d: common_vendor.p({
              to: "/pages/console/chat-item/chat-item",
              ["avatar-circle"]: false,
              title: value.nickname,
              avatar: value.avatar,
              note: value.lastMsg,
              showSwitch: true,
              clickable: true,
              link: "navigateTo",
              ["badge-positon"]: "left",
              ["badge-text"]: common_vendor.unref(store).badges[value.username],
              showBadge: common_vendor.unref(store).badges[value.username],
              time: formatTime(value.lastTime)
            })
          };
        }),
        b: common_vendor.p({
          border: true
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/otz/wechat-otz/pages/console/chat/chat.vue"]]);
wx.createComponent(Component);
