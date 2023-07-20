"use strict";
const common_vendor = require("../common/vendor.js");
const common_operate = require("../common/operate.js");
require("../store/index.js");
const post = (url, data, headers, other) => {
  let hideLoading = false;
  if (!(other == null ? void 0 : other.hideToast) && !hideLoading) {
    common_vendor.index.showLoading({
      title: "加载中..."
    });
  }
  console.log("cookie===> ", common_vendor.wx$1.getStorageSync("cookie"));
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: common_operate.operate.api + url,
      data,
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        Cookie: common_vendor.wx$1.getStorageSync("cookie"),
        ...headers
      },
      success: (res) => {
        if (res.statusCode === 403) {
          return;
        }
        if (res.statusCode && res.statusCode != 200) {
          common_vendor.index.showToast({
            title: "api错误" + res.errMsg,
            icon: "none"
          });
          return;
        }
        if (res.header["Set-Cookie"]) {
          common_vendor.wx$1.setStorageSync("cookie", res.header["Set-Cookie"]);
        }
        resolve(res.data);
      },
      fail: (e) => {
        common_vendor.index.showToast({
          title: "" + e.data.msg,
          icon: "none"
        });
        resolve(e.data);
      },
      complete() {
        {
          common_vendor.index.hideLoading();
        }
        resolve();
        return;
      }
    });
  });
};
exports.post = post;
