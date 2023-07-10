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
  __name: "staff",
  setup(__props) {
    const {
      proxy
    } = common_vendor.getCurrentInstance();
    common_vendor.onMounted(() => {
      console.log(proxy.$store.state.friendInfos);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(proxy).$store.state.friendInfos, (item, index, i0) => {
          return {
            a: index,
            b: "477074a2-1-" + i0 + ",477074a2-0",
            c: common_vendor.p({
              ["avatar-circle"]: true,
              title: item.nickname,
              avatar: item.avatar,
              showSwitch: true,
              clickable: true
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
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/otz/wechat-otz/pages/console/staff/staff.vue"]]);
wx.createComponent(Component);
