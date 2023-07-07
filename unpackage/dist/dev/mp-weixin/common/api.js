"use strict";
const utils_request = require("../utils/request.js");
const common_ApiPath = require("./ApiPath.js");
let post = new utils_request.Request().post;
const api = {
  login: function(data) {
    return post(common_ApiPath.otz.USER_LOGIN, data);
  },
  getCode: function(data) {
    return post(common_ApiPath.otz.SEND_VERIFY_CODE, data);
  },
  getLoginStatus: function(data = {}) {
    return post(common_ApiPath.otz.USER_LOGIN_STATUS, data);
  },
  getMsgs: function(data) {
    return post(common_ApiPath.otz.USER_GET_MSGS, data);
  },
  getFriends: function(data) {
    return post(common_ApiPath.otz.USER_GET_FRIEND, data);
  }
};
exports.api = api;
