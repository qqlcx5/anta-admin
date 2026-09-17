import { shallowRef, unref, onBeforeUnmount, type Ref } from "vue";
import { isClient } from "@vueuse/core";
export { useResizeObserver } from "@vueuse/core";

/**
 * 原生 classList 操作
 */
export function hasClass(el: Element, cls: string): boolean {
  if (!el || !cls) return false;
  return el.classList.contains(cls);
}

export function addClass(el: Element, cls: string) {
  if (!el || !cls) return;
  const classes = cls.split(" ").filter(Boolean);
  el.classList.add(...classes);
}

export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return;
  const classes = cls.split(" ").filter(Boolean);
  el.classList.remove(...classes);
}

export function toggleClass(el: Element, cls: string) {
  if (!el || !cls) return;
  el.classList.toggle(cls);
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

export interface WatermarkOptions {
  width?: number;
  height?: number;
  rotate?: number;
  font?: string;
  fillStyle?: string;
  zIndex?: number;
}

export function useWatermark(
  appendEl: Ref<HTMLElement | null | undefined> = shallowRef(
    isClient ? document.body : undefined
  )
) {
  const id = "anta-watermark-dom";
  const watermarkEl = shallowRef<HTMLElement | null>(null);

  const clear = () => {
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

    const {
      width = 240,
      height = 120,
      rotate = -20,
      font = "16px sans-serif",
      fillStyle = "rgba(0, 0, 0, 0.12)",
      zIndex = 9999
    } = options;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.rotate((rotate * Math.PI) / 180);
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = "left";
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
  };

  onBeforeUnmount(clear);

  return { setWatermark, clear };
}
