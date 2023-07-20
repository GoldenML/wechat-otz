"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/console/console.js";
  "./pages/console/chat-item/chat-item.js";
  "./pages/console/user-info/user-info.js";
}
function deepClone(source) {
  const target = source.constructor === Array ? [] : {};
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const element = source[key];
      if (element && typeof element === "object") {
        target[key] = deepClone(source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.config.globalProperties.$deepClone = deepClone;
  app.use(store_index.Store);
  app.use(common_vendor.uView);
  app.use(common_vendor.createPinia());
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
