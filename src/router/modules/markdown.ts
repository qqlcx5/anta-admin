import { $t } from "@/plugins/i18n";
import { markdown } from "@/router/enums";

export default {
  path: "/markdown",
  redirect: "/markdown/index",
  meta: {
    icon: "ri:markdown-line",
    title: $t("menus.antaMarkdown"),
    rank: markdown
  },
  children: [
    {
      path: "/markdown/index",
      name: "Markdown",
      component: () => import("@/views/markdown/index.vue"),
      meta: {
        title: $t("menus.antaMarkdown"),
        extraIcon: "ri:sparkling-fill"
      }
    }
  ]
} satisfies RouteConfigsTable;
