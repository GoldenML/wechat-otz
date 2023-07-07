"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {}
};
if (!Array) {
  const _easycom_uni_list_chat2 = common_vendor.resolveComponent("uni-list-chat");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  (_easycom_uni_list_chat2 + _easycom_uni_list2)();
}
const _easycom_uni_list_chat = () => "./uni_modules/uni-list/components/uni-list-chat/uni-list-chat.js";
const _easycom_uni_list = () => "./uni_modules/uni-list/components/uni-list/uni-list.js";
if (!Math) {
  (_easycom_uni_list_chat + _easycom_uni_list)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      ["avatar-circle"]: true,
      title: "uni-app",
      avatar: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
      note: "您收到一条新的消息",
      time: "2020-02-02 20:20"
    }),
    b: common_vendor.p({
      ["avatar-circle"]: true,
      title: "uni-app",
      avatar: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
      note: "您收到一条新的消息",
      time: "2020-02-02 20:20"
    }),
    c: common_vendor.p({
      border: true
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/otz/wechat-otz/pages/console/chat/chat.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
