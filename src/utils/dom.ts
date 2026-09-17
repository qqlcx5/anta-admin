import { shallowRef, unref, onBeforeUnmount, type Ref } from "vue";
import { isClient, useResizeObserver as _useResizeObserver, type UseResizeObserverOptions } from "@vueuse/core";

/**
 * 监听 DOM 尺寸变化（复用 @vueuse/core，支持 ElementRef、DOM 元素或选择器字符串）
 */
export function useResizeObserver(
  target: any,
  callback: ResizeObserverCallback,
  options?: UseResizeObserverOptions
) {
  const el = typeof target === "string"
    ? () => (isClient ? (document.querySelector(target) as HTMLElement | null) : null)
    : target;
  return _useResizeObserver(el, callback, options);
}

/**
 * 原生 classList 操作：判断元素是否存在指定类名
 */
export function hasClass(element: HTMLElement | Element, name: string): boolean {
  if (!element || !name) return false;
  return element.classList ? element.classList.contains(name) : false;
}

/**
 * 原生 classList 操作：添加类名
 */
export function addClass(
  element: HTMLElement | Element,
  name: string,
  extraName?: string
): void {
  if (!element || !name) return;
  if (element.classList) {
    name.split(" ").filter(Boolean).forEach(cls => element.classList.add(cls));
    if (extraName) {
      extraName.split(" ").filter(Boolean).forEach(cls => element.classList.add(cls));
    }
  }
}

/**
 * 原生 classList 操作：删除类名
 */
export function removeClass(
  element: HTMLElement | Element,
  name: string,
  extraName?: string
): void {
  if (!element || !name) return;
  if (element.classList) {
    name.split(" ").filter(Boolean).forEach(cls => element.classList.remove(cls));
    if (extraName) {
      extraName.split(" ").filter(Boolean).forEach(cls => element.classList.remove(cls));
    }
  }
}

/**
 * 原生 classList 操作：切换类名
 * @param bool 为 true 添加，为 false 移除
 * @param name 类名
 * @param element 目标元素，默认 document.body
 */
export function toggleClass(
  bool: boolean,
  name: string,
  element?: HTMLElement | Element
): void {
  if (!isClient) return;
  const target = element || document.body;
  if (!target || !name) return;
  if (bool) {
    addClass(target, name);
  } else {
    removeClass(target, name);
  }
}

/**
 * 原生 classList 操作：获取所有类名
 */
export function getClass(element: HTMLElement | Element): string | string[] {
  if (!element) return "";
  const classList = Array.from(element.classList || []);
  return classList.length === 1 ? classList[0] : classList;
}

/**
 * 打开外部链接
 */
export function openLink(href: string, target = "_blank") {
  if (!isClient) return;
  window.open(href, target);
}

/**
 * 文本复制到剪贴板
 */
export function copyTextToClipboard(text: string): boolean {
  if (!isClient) return false;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
    return true;
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch {}
  textArea.remove();
  return success;
}

export function useCopyToClipboard(initial = "") {
  const clipboardValue = shallowRef(initial);
  const copied = shallowRef(false);

  const update = (text: string) => {
    clipboardValue.value = text;
    copied.value = copyTextToClipboard(text);
    if (copied.value) {
      setTimeout(() => {
        copied.value = false;
      }, 1500);
    }
  };

  return { clipboardValue, copied, update };
}

export interface gradientType {
  value: number;
  color: string;
}

export interface WatermarkOptions {
  width?: number;
  height?: number;
  rotate?: number;
  font?: string;
  color?: string;
  fillStyle?: string;
  zIndex?: number | string;
  gradient?: Array<gradientType>;
  shadowConfig?: Array<any>;
  globalAlpha?: number;
  lineHeight?: number;
  wrap?: string;
  textAlign?: CanvasTextAlign;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  forever?: boolean;
  verticalOffset?: number;
  [key: string]: any;
}

export function useWatermark(
  appendEl: Ref<HTMLElement | null | undefined> = shallowRef(
    isClient ? document.body : undefined
  )
) {
  const id = "anta-watermark-dom";
  const watermarkEl = shallowRef<HTMLElement | null>(null);
  let observer: MutationObserver | null = null;

  const clear = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    const dom = unref(watermarkEl);
    const parent = unref(appendEl) || (isClient ? document.body : null);
    if (dom && parent && parent.contains(dom)) {
      parent.removeChild(dom);
    }
    watermarkEl.value = null;
  };

  const setWatermark = (str: string, options: WatermarkOptions = {}) => {
    if (!isClient) return;
    clear();

    const parent = unref(appendEl) || document.body;
    if (!parent) return;

    if (parent !== document.body && getComputedStyle(parent).position === "static") {
      parent.style.position = "relative";
    }

    const {
      width = 240,
      height = 120,
      rotate = -20,
      font = "16px sans-serif",
      fillStyle = options.color || "rgba(0, 0, 0, 0.12)",
      zIndex = 9999
    } = options;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (options.globalAlpha !== undefined) {
      ctx.globalAlpha = options.globalAlpha;
    }

    ctx.rotate((rotate * Math.PI) / 180);
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = options.textAlign || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(str, 20, height / 2);

    const base64Url = canvas.toDataURL();
    const div = document.createElement("div");
    div.id = id;
    div.style.pointerEvents = "none";
    div.style.top = "0px";
    div.style.left = "0px";
    div.style.position = "absolute";
    div.style.zIndex = `${zIndex}`;
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.background = `url(${base64Url}) left top repeat`;

    parent.appendChild(div);
    watermarkEl.value = div;

    if (options.forever && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(mutations => {
        const isRemoved = !parent.contains(div);
        if (isRemoved) {
          observer?.disconnect();
          observer = null;
          setWatermark(str, options);
        }
      });
      observer.observe(parent, { childList: true, subtree: true });
    }
  };

  onBeforeUnmount(clear);

  return { setWatermark, clear };
}
