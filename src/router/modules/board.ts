import { $t } from "@/plugins/i18n";
import { board } from "@/router/enums";
const IFrame = () => import("@/layout/frame.vue");

export default {
  path: "/board",
  redirect: "/board/index",
  meta: {
    icon: "ri/artboard-line",
    title: $t("menus.antaBoard"),
    rank: board
  },
  children: [
    {
      path: "/board/index",
      name: "FrameBoard",
      component: IFrame,
      meta: {
        title: $t("menus.antaBoard"),
        keepAlive: true,
        frameSrc: "https://songlh.top/paint-board/"
      }
    }
  ]
} satisfies RouteConfigsTable;
