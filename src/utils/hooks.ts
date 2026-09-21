import { getCurrentInstance } from "vue";
import { isClient } from "./is";

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

import { useDark as _useDark } from "@vueuse/core";

/**
 * 暗黑模式 Hook（复用 @vueuse/core，纯粹监听 HTML class，不写独立 localStorage 以免冲突）
 */
export function useDark(options?: {
  selector?: "html" | "body";
  className?: string;
}) {
  const isDark = _useDark({
    selector: options?.selector || "html",
    attribute: "class",
    valueDark: options?.className || "dark",
    valueLight: "",
    storageKey: null
  });
  return {
    isDark,
    toggleDark: () => {
      isDark.value = !isDark.value;
    }
  };
}

/**
 * 动态加载脚本与样式资源 Hook
 */
export function useLoader() {
  const loadScript = (
    optionsOrSrc: string | string[] | { src: string | string[] }
  ): Promise<Array<{ src: string; message: string }>> => {
    if (!isClient) return Promise.resolve([]);
    const raw =
      typeof optionsOrSrc === "object" && !Array.isArray(optionsOrSrc)
        ? optionsOrSrc.src
        : optionsOrSrc;
    const srcs = Array.isArray(raw) ? raw : [raw];
    return Promise.all(
      srcs.map(
        s =>
          new Promise<{ src: string; message: string }>((resolve, reject) => {
            const existing = document.querySelector(`script[src="${s}"]`);
            if (existing) {
              resolve({ src: s, message: "加载成功" });
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
