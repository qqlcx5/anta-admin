import { $t } from "@/plugins/i18n";
import { editor } from "@/router/enums";

export default {
  path: "/editor",
  redirect: "/editor/index",
  meta: {
    icon: "ep:edit",
    title: $t("menus.antaEditor"),
    rank: editor
  },
  children: [
    {
      path: "/editor/index",
      name: "Editor",
      component: () => import("@/views/editor/index.vue"),
      meta: {
        title: $t("menus.antaEditor"),
        keepAlive: true
      }
    }
  ]
} satisfies RouteConfigsTable;
