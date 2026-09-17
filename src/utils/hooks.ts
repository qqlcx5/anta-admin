import {
  ref,
  unref,
  watch,
  nextTick,
  computed,
  shallowRef,
  onBeforeMount,
  onBeforeUnmount,
  getCurrentInstance,
  type Ref
} from "vue";
import type { EChartsOption, ECharts } from "echarts";
import { isClient } from "./is";
import { delay } from "./tools";

/**
 * 获取全局注入的属性（如 $storage, $config, $echarts 等）
 */
export function useGlobal<T = Record<string, any>>(): T {
  const instance = getCurrentInstance();
  if (!instance) {
    return {} as T;
  }
  return instance.appContext.config.globalProperties as T;
}

/**
 * 暗黑模式 Hook
 */
export function useDark(options?: { className?: string; selector?: string }) {
  const className = options?.className ?? "dark";
  const isDark = shallowRef(false);
  let observer: MutationObserver | null = null;

  const getTarget = () => {
    if (!isClient) return null;
    return options?.selector === "body"
      ? document.body
      : document.documentElement;
  };

  const update = () => {
    const target = getTarget();
    if (!target) return;
    isDark.value = target.classList.contains(className);
  };

  const toggleDark = () => {
    const target = getTarget();
    if (!target) return;
    target.classList.toggle(className);
    update();
  };

  onBeforeMount(() => {
    update();
    const target = getTarget();
    if (target && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(update);
      observer.observe(target, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }
  });

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });

  return { isDark, toggleDark };
}

export interface UseEchartsOptions {
  theme?: Ref<string> | string;
  [key: string]: any;
}

/**
 * ECharts 管理 Hook
 */
export function useECharts(
  elRef: Ref<HTMLDivElement | null | undefined>,
  options: UseEchartsOptions = {}
) {
  const global = useGlobal<any>();
  const echartsInstance = global.$echarts;

  const theme = computed(() => {
    if (!options.theme) return "default";
    return unref(options.theme);
  });

  let chartInstance: ECharts | null = null;
  const chartOptions = ref<EChartsOption>({});

  function initChart(currentTheme = theme.value) {
    const el = unref(elRef);
    if (!el || !echartsInstance) return;
    chartInstance = echartsInstance.init(el, currentTheme, options);
  }

  function setOptions(opt: EChartsOption, clear = true) {
    chartOptions.value = opt;
    const el = unref(elRef);
    if (!el) return;

    if (el.offsetHeight === 0) {
      delay(30).then(() => setOptions(opt, clear));
      return;
    }

    nextTick(() => {
      delay(30).then(() => {
        if (!chartInstance) {
          initChart(theme.value);
        }
        if (clear) {
          chartInstance?.clear();
        }
        chartInstance?.setOption(opt);
      });
    });
  }

  function resize() {
    chartInstance?.resize();
  }

  function getInstance(): ECharts | null {
    if (!chartInstance) {
      initChart(theme.value);
    }
    return chartInstance;
  }

  function showLoading(params?: any) {
    chartInstance?.showLoading(params?.type ?? "default", params?.opts ?? {});
  }

  function hideLoading() {
    chartInstance?.hideLoading();
  }

  function clear() {
    chartInstance?.clear();
  }

  function getDom() {
    return chartInstance?.getDom();
  }

  watch(
    () => theme.value,
    newTheme => {
      if (chartInstance) {
        chartInstance.dispose();
        initChart(newTheme);
        chartInstance?.setOption(chartOptions.value);
      }
    }
  );

  const handleResize = () => {
    resize();
  };

  if (isClient) {
    window.addEventListener("resize", handleResize);
  }

  onBeforeUnmount(() => {
    if (isClient) {
      window.removeEventListener("resize", handleResize);
    }
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  });

  return {
    echarts: echartsInstance,
    setOptions,
    resize,
    getInstance,
    showLoading,
    hideLoading,
    clear,
    getDom
  };
}

/**
 * 动态加载脚本与样式资源 Hook
 */
export function useLoader() {
  const loadScript = (src: string | string[]) => {
    if (!isClient) return Promise.resolve([]);
    const srcs = Array.isArray(src) ? src : [src];
    return Promise.all(
      srcs.map(
        s =>
          new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${s}"]`);
            if (existing) {
              resolve({ src: s, message: "已加载" });
              return;
            }
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = s;
            script.onload = () => resolve({ src: s, message: "加载成功" });
            script.onerror = () => reject(new Error(`加载失败: ${s}`));
            document.body.appendChild(script);
          })
      )
    );
  };

  const loadCss = (href: string | string[]) => {
    if (!isClient) return Promise.resolve([]);
    const hrefs = Array.isArray(href) ? href : [href];
    return Promise.all(
      hrefs.map(
        h =>
          new Promise((resolve, reject) => {
            const existing = document.querySelector(`link[href="${h}"]`);
            if (existing) {
              resolve({ href: h, message: "已加载" });
              return;
            }
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = h;
            link.onload = () => resolve({ href: h, message: "加载成功" });
            link.onerror = () => reject(new Error(`加载失败: ${h}`));
            document.head.appendChild(link);
          })
      )
    );
  };

  return { loadScript, loadCss };
}
