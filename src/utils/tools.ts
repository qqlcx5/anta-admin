import {
  debounce as _debounce,
  throttle as _throttle,
  sum,
  omit,
  pick,
  intersection
} from "lodash-es";
import { isClient } from "@vueuse/core";

export { sum, omit, pick, intersection };

/**
 * 防抖函数（复用 lodash-es，兼容 immediate: boolean）
 * 兼容 @pureadmin/utils 行为：当 func 不是函数时静默返回 noop，而非报错
 */
export const debounce = (
  func: (...args: any[]) => any,
  wait = 200,
  immediate: boolean | { leading?: boolean; trailing?: boolean } = false
) => {
  if (typeof func !== "function") return () => {};
  const options =
    typeof immediate === "boolean"
      ? { leading: immediate, trailing: !immediate }
      : immediate;
  return _debounce(func, wait, options);
};

/**
 * 节流函数（复用 lodash-es）
 */
export const throttle = (
  func: (...args: any[]) => any,
  wait = 1000,
  options?: any
) => _throttle(func, wait, options);

/**
 * 延迟等待 Promise
 */
export const delay = (ms = 20): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * 移动设备检测
 */
export function deviceDetection(): boolean {
  if (!isClient) return false;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    window.navigator.userAgent
  );
}

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * 获取对象数组中某一字段的所有值
 */
export function getKeyList<T = any>(
  arr: any[],
  key: string,
  unique = true
): T[] {
  if (!Array.isArray(arr)) return [];
  const list = arr
    .map(item => item?.[key])
    .filter(v => v !== undefined && v !== null);
  return unique ? Array.from(new Set(list)) : list;
}

/**
 * 从对象中删除指定属性
 */
export function delObjectProperty<T extends Record<string, any>>(
  obj: T,
  props: string | string[]
): any {
  return omit(obj, props);
}

/**
 * 从对象数组中提取指定字段
 */
export function extractFields<T = any>(list: any[], ...fields: string[]): T[] {
  if (!Array.isArray(list)) return [];
  return list.map(item => pick(item, fields) as unknown as T);
}

export interface FormDataOptions {
  fileKey?: string;
  filter?: string[];
  handleFile?: (data: {
    file: File | Blob;
    key: string;
    formData: FormData;
  }) => void;
}

/**
 * 对象转 FormData
 */
export function createFormData(
  data: Record<string, any>,
  options: FormDataOptions = {}
): FormData {
  const formData = new FormData();
  const fileKey = options.fileKey || "file";
  const filter = options.filter || [];

  const append = (key: string, value: any) => {
    if (filter.includes(key)) return;
    if (
      options.handleFile &&
      (value instanceof File || value instanceof Blob)
    ) {
      options.handleFile({ file: value, key, formData });
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(
        fileKey,
        value,
        value instanceof File ? value.name : undefined
      );
    } else if (Array.isArray(value)) {
      value.forEach((v, index) => {
        append(`${key}[${index}]`, v);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach(k => {
        append(`${key}[${k}]`, value[k]);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  };

  Object.keys(data).forEach(key => {
    append(key, data[key]);
  });

  return formData;
}

/**
 * 解析 URL query 字符串
 */
export function getQueryMap(url?: string): Record<string, string> {
  const targetUrl = url || (isClient ? window.location.href : "");
  if (!targetUrl || targetUrl.indexOf("?") === -1) return {};
  const queryPart = targetUrl.slice(targetUrl.indexOf("?") + 1);
  const searchParams = new URLSearchParams(queryPart);
  const result: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * 解析 SVG 字符串的基础信息
 */
export function getSvgInfo(svgString: string): {
  width: number;
  height: number;
  body: string;
} {
  if (!isClient || !svgString) return { width: 0, height: 0, body: "" };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return { width: 0, height: 0, body: "" };
    // 优先从 viewBox 解析尺寸：unplugin-icons 的 ?raw 输出 width/height 为 "1em"，
    // parseFloat("1em") 会得到 1，导致 addIcon 注册出 viewBox="0 0 1 1" 使图标不可见
    let width = 0;
    let height = 0;
    const viewBox = svg.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.split(/[\s,]+/).map(Number.parseFloat);
      if (parts.length === 4 && parts.every(n => !Number.isNaN(n))) {
        width = parts[2];
        height = parts[3];
      }
    }
    if (!width) width = parseFloat(svg.getAttribute("width") || "0") || 0;
    if (!height) height = parseFloat(svg.getAttribute("height") || "0") || 0;
    return { width, height, body: svg.innerHTML };
  } catch {
    return { width: 0, height: 0, body: "" };
  }
}

/**
 * 转换时间秒数为 { h, m, s }
 */
export function getTime(
  seconds: number,
  padZero = true
): { h: string | number; m: string | number; s: string | number } {
  const sec = Number.isNaN(seconds) || seconds < 0 ? 0 : seconds;
  const pad = (n: number) => {
    const floor = Math.floor(n);
    return floor < 10 && padZero ? `0${floor}` : floor;
  };
  const h = pad(sec / 3600);
  const m = pad((sec % 3600) / 60);
  const s = pad(sec % 60);
  return { h, m, s };
}

/**
 * 在指定下标脱敏文字
 */
export function hideTextAtIndex(
  str: string | number,
  index: number | number[] | { start: number; end: number },
  symbol = "*"
): string {
  const text = String(str);
  const chars = text.split("");

  if (typeof index === "number") {
    if (index >= 0 && index < chars.length) chars[index] = symbol;
  } else if (Array.isArray(index)) {
    index.forEach(i => {
      if (i >= 0 && i < chars.length) chars[i] = symbol;
    });
  } else if (index && typeof index === "object") {
    const { start, end } = index;
    for (let i = start; i <= end && i < chars.length; i++) {
      if (i >= 0) chars[i] = symbol;
    }
  }
  return chars.join("");
}

/**
 * 截取分隔符之前的字符串
 */
export function subBefore(str: string, separator: string): string {
  if (typeof separator !== "string" || typeof str !== "string") return "";
  const index = str.indexOf(separator);
  // 与原版 @pureadmin/utils 一致：未找到分隔符时返回空字符串（而非原字符串）
  return index === -1 ? "" : str.slice(0, index);
}

/**
 * 截取分隔符之后的字符串
 */
export function subAfter(str: string, separator: string): string {
  if (typeof separator !== "string" || typeof str !== "string") return "";
  // 与原版 @pureadmin/utils 一致：基于“最后一次出现”的分隔符截取；未找到时返回原字符串
  return str.substring(str.lastIndexOf(separator) + separator.length);
}
