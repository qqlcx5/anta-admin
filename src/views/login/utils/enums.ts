import { $t } from "@/plugins/i18n";

const operates = [
  {
    title: $t("login.antaPhoneLogin")
  },
  {
    title: $t("login.antaQRCodeLogin")
  },
  {
    title: $t("login.antaRegister")
  }
];

const thirdParty = [
  {
    title: $t("login.antaWeChatLogin"),
    icon: "wechat"
  },
  {
    title: $t("login.antaAlipayLogin"),
    icon: "alipay"
  },
  {
    title: $t("login.antaQQLogin"),
    icon: "qq"
  },
  {
    title: $t("login.antaWeiBoLogin"),
    icon: "weibo"
  }
];

export { operates, thirdParty };
