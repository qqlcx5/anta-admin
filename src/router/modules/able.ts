import { $t } from "@/plugins/i18n";
import { able } from "@/router/enums";

export default {
  path: "/able",
  redirect: "/able/watermark",
  meta: {
    icon: "ri/ubuntu-fill",
    title: $t("menus.antaAble"),
    rank: able
  },
  children: [
    {
      path: "/able/mqtt-client",
      name: "MqttClient",
      component: () => import("@/views/able/mqtt-client.vue"),
      meta: {
        title: $t("menus.antaMqtt")
      }
    },
    {
      path: "/able/verify",
      name: "Verify",
      component: () => import("@/views/able/verify.vue"),
      meta: {
        title: $t("menus.antaVerify")
      }
    },
    {
      path: "/able/watermark",
      name: "WaterMark",
      component: () => import("@/views/able/watermark.vue"),
      meta: {
        title: $t("menus.antaWatermark")
      }
    },
    {
      path: "/able/print",
      name: "Print",
      component: () => import("@/views/able/print/index.vue"),
      meta: {
        title: $t("menus.antaPrint")
      }
    },
    {
      path: "/able/download",
      name: "Download",
      component: () => import("@/views/able/download.vue"),
      meta: {
        title: $t("menus.antaDownload")
      }
    },
    {
      path: "/able/excel",
      name: "Excel",
      component: () => import("@/views/able/excel.vue"),
      meta: {
        title: $t("menus.antaExcel")
      }
    },
    {
      path: "/components/ripple",
      name: "Ripple",
      component: () => import("@/views/able/ripple.vue"),
      meta: {
        title: $t("menus.antaRipple")
      }
    },
    {
      path: "/able/debounce",
      name: "Debounce",
      component: () => import("@/views/able/debounce.vue"),
      meta: {
        title: $t("menus.antaDebounce")
      }
    },
    {
      path: "/able/directives",
      name: "Directives",
      component: () => import("@/views/able/directives.vue"),
      meta: {
        title: $t("menus.antaOptimize")
      }
    },
    {
      path: "/able/draggable",
      name: "Draggable",
      component: () => import("@/views/able/draggable.vue"),
      meta: {
        title: $t("menus.antaDraggable"),
        transition: {
          enterTransition: "animate__zoomIn",
          leaveTransition: "animate__zoomOut"
        }
      }
    },
    {
      path: "/able/pdf",
      name: "Pdf",
      component: () => import("@/views/able/pdf.vue"),
      meta: {
        title: $t("menus.antaPdf")
      }
    },
    {
      path: "/able/barcode",
      name: "BarCode",
      component: () => import("@/views/able/barcode.vue"),
      meta: {
        title: $t("menus.antaBarcode")
      }
    },
    {
      path: "/able/qrcode",
      name: "QrCode",
      component: () => import("@/views/able/qrcode.vue"),
      meta: {
        title: $t("menus.antaQrcode")
      }
    },
    {
      path: "/able/map",
      name: "MapPage",
      component: () => import("@/views/able/map.vue"),
      meta: {
        title: $t("menus.antaMap"),
        keepAlive: true,
        transition: {
          name: "fade"
        }
      }
    },
    {
      path: "/able/wavesurfer",
      name: "Wavesurfer",
      component: () => import("@/views/able/wavesurfer/index.vue"),
      meta: {
        title: $t("menus.antaWavesurfer")
      }
    },
    {
      path: "/able/video",
      name: "VideoPage",
      component: () => import("@/views/able/video.vue"),
      meta: {
        title: $t("menus.antaVideo")
      }
    },
    {
      path: "/able/video-frame",
      name: "VideoFrame",
      component: () => import("@/views/able/video-frame/index.vue"),
      meta: {
        title: $t("menus.antaVideoFrame")
      }
    },
    {
      path: "/able/danmaku",
      name: "Danmaku",
      component: () => import("@/views/able/danmaku/index.vue"),
      meta: {
        title: $t("menus.antaDanmaku")
      }
    },
    {
      path: "/able/infinite-scroll",
      name: "InfiniteScroll",
      component: () => import("@/views/able/infinite-scroll.vue"),
      meta: {
        title: $t("menus.antaInfiniteScroll")
      }
    },
    {
      path: "/able/menu-tree",
      name: "MenuTree",
      component: () => import("@/views/able/menu-tree.vue"),
      meta: {
        title: $t("menus.antaMenuTree")
      }
    },
    {
      path: "/able/line-tree",
      name: "LineTree",
      component: () => import("@/views/able/line-tree.vue"),
      meta: {
        title: $t("menus.antaLineTree")
      }
    },
    {
      path: "/able/typeit",
      name: "Typeit",
      component: () => import("@/views/able/typeit.vue"),
      meta: {
        title: $t("menus.antaTypeit")
      }
    },
    {
      path: "/able/sensitive",
      name: "Sensitive",
      component: () => import("@/views/able/sensitive.vue"),
      meta: {
        title: $t("menus.antaSensitive")
      }
    },
    {
      path: "/able/pinyin",
      name: "Pinyin",
      component: () => import("@/views/able/pinyin.vue"),
      meta: {
        title: $t("menus.antaPinyin")
      }
    }
  ]
} satisfies RouteConfigsTable;
