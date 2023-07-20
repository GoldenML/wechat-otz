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
  __name: "staff",
  setup(__props) {
    const store = store_userStore.userStore();
    common_vendor.onMounted(() => {
    });
    const onClick = (userInfo) => {
      store.updateLookUserInfo(userInfo);
    };
    const sendGroupMessage = (item) => {
      const idx = store.groupInfos.findIndex((e) => e.group_id === item.group_id);
      if (!store.msgs[item.group_id]) {
        store.msgs[item.group_id] = {
          type: 2,
          nickname: store.groupInfos[idx].group_name,
          avatar: store.groupInfos[idx].group_avatar,
          lastUsername: "",
          lastMsg: "",
          username: item.group_id,
          msgList: []
        };
      }
      store.updateOperateUsername(item.group_id);
      common_vendor.index.navigateTo({
        url: "/pages/console/chat-item/chat-item"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(store).groupInfos, (item, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(($event) => sendGroupMessage(item), index),
            c: "b520e742-1-" + i0 + ",b520e742-0",
            d: common_vendor.p({
              ["avatar-circle"]: true,
              title: item.group_name,
              avatar: item.group_avatar,
              showSwitch: true,
              clickable: true
            })
          };
        }),
        b: common_vendor.p({
          border: true
        }),
        c: common_vendor.f(common_vendor.unref(store).friendInfos, (item, index, i0) => {
          return {
            a: index,
            b: common_vendor.o(($event) => onClick(item), index),
            c: "b520e742-3-" + i0 + ",b520e742-2",
            d: common_vendor.p({
              ["avatar-circle"]: true,
              to: "/pages/console/user-info/user-info",
              link: "navigateTo",
              title: item.nickname,
              avatar: item.avatar,
              showSwitch: true,
              clickable: true
            })
          };
        }),
        d: common_vendor.p({
          border: true
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b520e742"], ["__file", "D:/otz/wechat-otz/pages/console/staff/staff.vue"]]);
wx.createComponent(Component);
