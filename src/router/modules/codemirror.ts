import { $t } from "@/plugins/i18n";
import { codemirror } from "@/router/enums";

export default {
  path: "/codemirror",
  redirect: "/codemirror/index",
  meta: {
    icon: "ri/code-box-line",
    title: $t("menus.antaCodeMirror"),
    rank: codemirror
  },
  children: [
    {
      path: "/codemirror/index",
      name: "CodeMirror",
      component: () => import("@/views/codemirror/index.vue"),
      meta: {
        title: $t("menus.antaCodeMirror"),
        extraIcon: "IF-anta-iconfont-new svg"
      }
    }
  ]
} satisfies RouteConfigsTable;
