"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const common_ApiPath = require("../../../common/ApiPath.js");
require("../../../common/operate.js");
require("../../../store/index.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_easyinput2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_easyinput)();
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
    const groupMember = common_vendor.computed(() => proxy.$store.state.groupMember);
    const cacheUser = common_vendor.computed(() => proxy.$store.state.cacheUser);
    const toView = common_vendor.ref("");
    common_vendor.ref("");
    const height = common_vendor.ref(0);
    common_vendor.ref(null);
    common_vendor.ref(0);
    const containerHeight = common_vendor.ref(0);
    common_vendor.ref(0);
    common_vendor.ref(0);
    common_vendor.onMounted(() => {
      console.log(operateUsername.value);
      proxy.$nextTick(() => {
        let query = common_vendor.wx$1.createSelectorQuery();
        query.select(".container").boundingClientRect((res) => {
          containerHeight.value = res.height;
        }).exec();
        query.select(".chat-input").boundingClientRect((res) => {
          height.value = Number(Number(res.top - containerHeight.value).toFixed(0));
        }).exec();
        scrollBottom();
      });
    });
    common_vendor.watch(() => msgs.value[operateUsername.value], (value) => {
      scrollBottom();
    });
    const handleShowInfo = () => {
    };
    const scrollBottom = () => {
      toView.value = "";
      proxy.$nextTick(() => {
        toView.value = "scroll-bottom";
      });
    };
    const formatDate = (value, type) => {
      var date = new Date(Number(value));
      date.getMonth() + 1;
      var hours = date.getHours();
      if (hours < 10)
        hours = "0" + hours;
      var minutes = date.getMinutes();
      if (minutes < 10)
        minutes = "0" + minutes;
      return hours + ":" + minutes;
    };
    const globalFunc = common_vendor.inject("globalFunc");
    const sendMessage = () => {
      message.value;
      console.log(operateUsername.value);
      const client_sequence = userInfo.value.username + (/* @__PURE__ */ new Date()).getTime();
      const data = {
        msg_type: 1,
        from_type: 1,
        to_type: msgs.value[operateUsername.value].type,
        to_username: operateUsername.value,
        text_msg: {
          text: message.value
        },
        from_username: userInfo.value.username,
        wait: true,
        client_sequence,
        formatTime: formatDate((/* @__PURE__ */ new Date()).getTime())
      };
      msgs.value[operateUsername.value].lastUsername = userInfo.value.username;
      msgs.value[operateUsername.value].lastMsg = message.value;
      msgs.value[operateUsername.value].msgList.push(data);
      message.value = "";
      scrollBottom();
      utils_request.post(common_ApiPath.otz.USER_SEND_MSG, {
        msg: data
      }, {}, {
        hideToast: true
      }).then((res) => {
        globalFunc.getUserMsg();
      });
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
          }, {
            h: msg.wait
          }, msg.wait ? {
            i: "e796f79c-1-" + i0,
            j: common_vendor.p({
              type: "spinner-cycle",
              size: "20"
            })
          } : {}) : common_vendor.e({
            k: common_vendor.t(msg.formatTime),
            l: msg.wait
          }, msg.wait ? {
            m: "e796f79c-2-" + i0,
            n: common_vendor.p({
              type: "spinner-cycle",
              size: "20"
            })
          } : {}, {
            o: msg.msg_type === 2
          }, msg.msg_type === 2 ? {
            p: msg.image_msg.image_url
          } : {
            q: common_vendor.t((_b2 = msg.text_msg) == null ? void 0 : _b2.text)
          }, {
            r: common_vendor.unref(userInfo).avatar,
            s: common_vendor.o(($event) => handleShowInfo(), msg.sequence)
          }), {
            t: msg.sequence,
            v: msg.sequence
          });
        })
      } : ((_d = common_vendor.unref(msgs)[common_vendor.unref(operateUsername)]) == null ? void 0 : _d.type) === 2 ? {
        f: common_vendor.f(common_vendor.unref(msgs)[common_vendor.unref(operateUsername)].msgList, (msg, k0, i0) => {
          var _a2, _b2, _c2, _d2, _e2;
          return common_vendor.e({
            a: msg.isSystemMsg
          }, msg.isSystemMsg ? {
            b: common_vendor.t(msg.formatTime),
            c: common_vendor.t((_a2 = msg.text_msg) == null ? void 0 : _a2.text)
          } : msg.from_username === common_vendor.unref(userInfo).username ? common_vendor.e({
            e: common_vendor.t(msg.formatTime),
            f: msg.wait
          }, msg.wait ? {
            g: "e796f79c-3-" + i0,
            h: common_vendor.p({
              type: "spinner-cycle",
              size: "20"
            })
          } : {}, {
            i: msg.msg_type === 2
          }, msg.msg_type === 2 ? {
            j: msg.image_msg.image_url
          } : {
            k: common_vendor.t((_b2 = msg.text_msg) == null ? void 0 : _b2.text)
          }, {
            l: common_vendor.unref(userInfo).avatar,
            m: common_vendor.o(($event) => handleShowInfo(), msg.sequence)
          }) : common_vendor.e({
            n: common_vendor.t(msg.formatTime),
            o: common_vendor.unref(groupMember)[common_vendor.unref(operateUsername)][msg.from_username] ? common_vendor.unref(groupMember)[common_vendor.unref(operateUsername)][msg.from_username].avatar : (_c2 = common_vendor.unref(cacheUser)[msg.from_username]) == null ? void 0 : _c2.avatar,
            p: common_vendor.o(($event) => handleShowInfo($event, false, true, msg.from_username), msg.sequence),
            q: common_vendor.t(common_vendor.unref(groupMember)[common_vendor.unref(operateUsername)][msg.from_username] ? common_vendor.unref(groupMember)[common_vendor.unref(operateUsername)][msg.from_username].nickname : (_d2 = common_vendor.unref(cacheUser)[msg.from_username]) == null ? void 0 : _d2.nickname),
            r: msg.msg_type === 2
          }, msg.msg_type === 2 ? {
            s: msg.image_msg.image_url
          } : {
            t: common_vendor.t((_e2 = msg.text_msg) == null ? void 0 : _e2.text)
          }, {
            v: msg.wait
          }, msg.wait ? {
            w: "e796f79c-4-" + i0,
            x: common_vendor.p({
              type: "spinner-cycle",
              size: "20"
            })
          } : {}), {
            d: msg.from_username === common_vendor.unref(userInfo).username,
            y: msg.sequence
          });
        })
      } : {}, {
        e: ((_e = common_vendor.unref(msgs)[common_vendor.unref(operateUsername)]) == null ? void 0 : _e.type) === 2,
        g: toView.value,
        h: height.value + "px",
        i: common_vendor.o(($event) => message.value = $event),
        j: common_vendor.p({
          autoHeight: true,
          modelValue: message.value
        }),
        k: !message.value,
        l: common_vendor.o(sendMessage)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/otz/wechat-otz/pages/console/chat-item/chat-item.vue"]]);
wx.createPage(MiniProgramPage);
