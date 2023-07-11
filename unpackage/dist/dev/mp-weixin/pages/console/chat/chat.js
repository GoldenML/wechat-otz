"use strict";
const common_vendor = require("../../../common/vendor.js");
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
    const {
      proxy
    } = common_vendor.getCurrentInstance();
    const badges = common_vendor.computed(() => proxy.$store.state.badges);
    const onClick = (username) => {
      proxy.$store.commit("updateOperateUsername", username);
      proxy.$store.commit("updateBadges", 0);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(proxy).$store.state.msgs, (value, key, i0) => {
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
              ["badge-text"]: common_vendor.unref(badges)[value.username],
              showBadge: common_vendor.unref(badges)[value.username],
              time: value.lastTime
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
