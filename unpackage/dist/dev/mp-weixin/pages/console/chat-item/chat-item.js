"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  (_easycom_uni_nav_bar2 + _easycom_uni_easyinput2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_easyinput)();
}
const _sfc_main = {
  __name: "chat-item",
  setup(__props) {
    const {
      proxy
    } = common_vendor.getCurrentInstance();
    const message = common_vendor.ref("");
    const back = () => {
      common_vendor.index.navigateBack({
        delta: 1
      });
    };
    const msgs = common_vendor.computed(() => proxy.$store.state.msgs);
    const operateUsername = common_vendor.computed(() => proxy.$store.state.operateUsername);
    const userInfo = common_vendor.computed(() => proxy.$store.state.userInfo);
    common_vendor.ref(0);
    common_vendor.ref(0);
    const footer = common_vendor.ref(null);
    common_vendor.ref(0);
    common_vendor.ref(0);
    common_vendor.onMounted(() => {
      proxy.$nextTick(() => {
        console.log("offsetHeight", footer);
      });
    });
    const handleShowInfo = () => {
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return common_vendor.e({
        a: common_vendor.o(back),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          color: "#000000",
          shadow: true,
          ["background-color"]: "rgb(245, 245, 245)",
          ["left-icon"]: "left",
          ["left-text"]: "返回",
          border: false,
          height: 60,
          title: (_a = common_vendor.unref(msgs)[common_vendor.unref(operateUsername)]) == null ? void 0 : _a.nickname
        }),
        c: ((_b = common_vendor.unref(msgs)[common_vendor.unref(operateUsername)]) == null ? void 0 : _b.type) === 1
      }, ((_c = common_vendor.unref(msgs)[common_vendor.unref(operateUsername)]) == null ? void 0 : _c.type) === 1 ? {
        d: common_vendor.f(common_vendor.unref(msgs)[common_vendor.unref(operateUsername)].msgList, (msg, k0, i0) => {
          var _a2, _b2;
          return common_vendor.e({
            a: msg.from_username === common_vendor.unref(msgs)[common_vendor.unref(operateUsername)].username
          }, msg.from_username === common_vendor.unref(msgs)[common_vendor.unref(operateUsername)].username ? common_vendor.e({
            b: common_vendor.t(msg.formatTime),
            c: common_vendor.unref(msgs)[common_vendor.unref(operateUsername)].avatar,
            d: common_vendor.o(($event) => handleShowInfo(), msg.sequence),
            e: msg.msg_type === 2
          }, msg.msg_type === 2 ? {
            f: msg.image_msg.image_url
          } : {
            g: common_vendor.t((_a2 = msg.text_msg) == null ? void 0 : _a2.text)
          }) : common_vendor.e({
            h: common_vendor.t(msg.formatTime),
            i: msg.msg_type === 2
          }, msg.msg_type === 2 ? {
            j: msg.image_msg.image_url
          } : {
            k: common_vendor.t((_b2 = msg.text_msg) == null ? void 0 : _b2.text)
          }, {
            l: common_vendor.unref(userInfo).avatar,
            m: common_vendor.o(($event) => handleShowInfo(), msg.sequence)
          }), {
            n: msg.sequence
          });
        })
      } : ((_d = common_vendor.unref(msgs)[common_vendor.unref(operateUsername)]) == null ? void 0 : _d.type) === 2 ? {} : {}, {
        e: ((_e = common_vendor.unref(msgs)[common_vendor.unref(operateUsername)]) == null ? void 0 : _e.type) === 2,
        f: common_vendor.o(($event) => message.value = $event),
        g: common_vendor.p({
          autoHeight: true,
          placeholder: "请输入内容",
          modelValue: message.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/workspace/wechat-otz/pages/console/chat-item/chat-item.vue"]]);
wx.createPage(MiniProgramPage);
