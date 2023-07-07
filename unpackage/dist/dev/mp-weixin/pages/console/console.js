"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api = require("../../common/api.js");
require("../../utils/request.js");
require("../../common/operate.js");
require("../../common/ApiPath.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (chat + _easycom_uni_icons)();
}
const chat = () => "./chat/chat2.js";
const _sfc_main = {
  __name: "console",
  setup(__props) {
    const currentItem = common_vendor.ref("chat");
    const store = common_vendor.useStore();
    const switchItem = (name) => {
      currentItem.value = name;
    };
    common_vendor.onMounted(() => {
      Promise.all([
        common_api.api.getLoginStatus().then((res) => {
          if (res.code === 0) {
            console.log(store.user_info);
            store.updateUserInfo(res.user_info);
          }
        })
      ]);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentItem.value !== "chat"
      }, currentItem.value !== "chat" ? {
        b: common_vendor.p({
          type: "chatbubble",
          size: 30
        })
      } : {
        c: common_vendor.p({
          type: "chatbubble-filled",
          size: 30
        })
      }, {
        d: common_vendor.o(($event) => switchItem("chat")),
        e: currentItem.value !== "staff"
      }, currentItem.value !== "staff" ? {
        f: common_vendor.p({
          type: "staff",
          size: 30
        })
      } : {
        g: common_vendor.p({
          type: "staff-filled",
          size: 30
        })
      }, {
        h: common_vendor.o(($event) => switchItem("staff")),
        i: currentItem.value !== "my"
      }, currentItem.value !== "my" ? {
        j: common_vendor.p({
          type: "person",
          size: 30
        })
      } : {
        k: common_vendor.p({
          type: "person-filled",
          size: 30
        })
      }, {
        l: common_vendor.o(($event) => switchItem("my"))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/otz/wechat-otz/pages/console/console.vue"]]);
wx.createPage(MiniProgramPage);
