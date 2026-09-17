import { shallowRef, unref, onBeforeUnmount, type Ref } from "vue";
import { isClient } from "./is";

export function hasClass(el: Element, cls: string): boolean {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1)
    throw new Error("className should not contain spaces.");
  return el.classList
    ? el.classList.contains(cls)
    : (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
}

export function addClass(el: Element, cls: string) {
  if (!el || !cls) return;
  const curClass = el.className || "";
  const classes = (cls || "").split(" ");
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;
    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      el.className = `${curClass} ${clsName}`;
    }
  }
}

export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return;
  const classes = cls.split(" ");
  let curClass = " " + (el.className || "") + " ";
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;
    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.className = curClass.trim();
  }
}

export function toggleClass(el: Element, cls: string) {
  if (!el || !cls) return;
  if (hasClass(el, cls)) {
    removeClass(el, cls);
  } else {
    addClass(el, cls);
  }
}

export function openLink(href: string, target = "_blank") {
  if (!isClient) return;
  const a = document.createElement("a");
  a.setAttribute("href", href);
  a.setAttribute("target", target);
  a.setAttribute("rel", "noopener noreferrer");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function copyTextToClipboard(
  text: string,
  { target = isClient ? document.body : undefined } = {}
): boolean {
  if (!isClient) return false;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
    return true;
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.contain = "strict";
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  textArea.style.fontSize = "12pt";

  const selection = document.getSelection();
  let originalRange: Range | null = null;
  if (selection && selection.rangeCount > 0) {
    originalRange = selection.getRangeAt(0);
  }

  (target || document.body).appendChild(textArea);
  textArea.select();
  textArea.selectionStart = 0;
  textArea.selectionEnd = text.length;

  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (err) {
    console.error("copyTextToClipboard error: ", err);
  }

  textArea.remove();
  if (originalRange && selection) {
    selection.removeAllRanges();
    selection.addRange(originalRange);
  }
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

export interface UseResizeObserverOptions {
  box?: ResizeObserverBoxOptions;
  immediate?: boolean;
}

export function useResizeObserver(
  target: any,
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {}
) {
  if (!isClient || typeof ResizeObserver === "undefined") {
    return { stop: () => {} };
  }

  const { box = "content-box" } = options;
  const observer = new ResizeObserver(callback);

  const getElement = () => {
    const el = unref(target);
    if (!el) return null;
    return (el as any).$el || el;
  };

  const el = getElement();
  if (el && el instanceof Element) {
    observer.observe(el, { box });
  }

  const stop = () => {
    observer.disconnect();
  };

  onBeforeUnmount(stop);

  return { stop };
}

export interface WatermarkOptions {
  width?: number;
  height?: number;
  rotate?: number;
  font?: string;
  fillStyle?: string;
  content?: string;
  zIndex?: number;
}

export function useWatermark(
  appendEl: Ref<HTMLElement | null | undefined> = shallowRef(
    isClient ? document.body : undefined
  )
) {
  const id = "watermark-dom-id";
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
