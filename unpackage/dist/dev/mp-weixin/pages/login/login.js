"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const counter = common_vendor.ref(0);
    const form = common_vendor.reactive({
      email: "",
      code: ""
    });
    const login = () => {
      proxy.$api.login({
        login_type: 2,
        email: form.email,
        verify_code: form.code
      }).then((res) => {
        if (res.code === 0) {
          common_vendor.index.reLaunch({
            url: "/pages/console/console"
          });
        }
      });
    };
    const getCode = () => {
      counter.value = 60;
      const timer = setInterval(() => {
        counter.value--;
        if (counter.value === 0) {
          clearInterval(timer);
        }
      }, 1e3);
      proxy.$api.getCode({
        email: form.email
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => form.email = $event),
        b: common_vendor.p({
          placeholder: "请输入邮箱",
          modelValue: form.email
        }),
        c: common_vendor.p({
          name: "email"
        }),
        d: common_vendor.o(($event) => form.code = $event),
        e: common_vendor.p({
          placeholder: "请输入验证码",
          type: "password",
          modelValue: form.code
        }),
        f: counter.value === 0
      }, counter.value === 0 ? {
        g: common_vendor.o(getCode)
      } : {
        h: common_vendor.t(counter.value)
      }, {
        i: common_vendor.p({
          name: "code"
        }),
        j: common_vendor.sr(form, "aa8250a8-0", {
          "k": "form"
        }),
        k: common_vendor.p({
          modelValue: form
        }),
        l: common_vendor.o(login)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/otz/wechat-otz/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
