"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const common_api = require("./common/api.js");
const store_index = require("./store/index.js");
require("./utils/request.js");
require("./common/operate.js");
require("./common/ApiPath.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/console/console.js";
  "./pages/console/chat/chat.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.warn("当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/otz/wechat-otz/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.config.globalProperties.$api = common_api.api;
  app.use(store_index.Store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
