import { isClient, isNumber, isObject, isUrl } from "./is";

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait = 200,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) fn.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait = 200
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
}

/**
 * 延迟等待 Promise
 */
export function delay(ms = 20): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 设备类型检测（是否为移动设备）
 */
export function deviceDetection(): boolean {
  if (!isClient) return false;
  const ua = window.navigator.userAgent.toLowerCase();
  const isIpad = ua.match(/ipad/i)?.[0] === "ipad";
  const isIphone = ua.match(/iphone os/i)?.[0] === "iphone os";
  const isMidp = ua.match(/midp/i)?.[0] === "midp";
  const isUc7 = ua.match(/rv:1.2.3.4/i)?.[0] === "rv:1.2.3.4";
  const isUc = ua.match(/ucweb/i)?.[0] === "ucweb";
  const isAndroid = ua.match(/android/i)?.[0] === "android";
  const isCe = ua.match(/windows ce/i)?.[0] === "windows ce";
  const isWm = ua.match(/windows mobile/i)?.[0] === "windows mobile";
  return (
    isIpad || isIphone || isMidp || isUc7 || isUc || isAndroid || isCe || isWm
  );
}

/**
 * 格式化字节数
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
 * 数组求和
 */
export function sum(arr: number[]): number {
  return (arr || []).reduce((acc, cur) => acc + (Number(cur) || 0), 0);
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
  const list: any[] = [];
  for (const item of arr) {
    if (item && item[key] !== undefined && item[key] !== null) {
      list.push(item[key]);
    }
  }
  return unique ? Array.from(new Set(list)) : list;
}

/**
 * 从对象中删除指定属性并返回新对象
 */
export function delObjectProperty<T extends Record<string, any>>(
  obj: T,
  props: string | string[]
): Partial<T> {
  const result: any = { ...obj };
  const keys = Array.isArray(props) ? props : [props];
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * 从对象数组中提取指定字段
 */
export function extractFields<T = any>(list: any[], ...fields: string[]): T[] {
  if (!Array.isArray(list)) return [];
  return list.map(item => {
    const obj: any = {};
    for (const f of fields) {
      obj[f] = item?.[f];
    }
    return obj;
  });
}

/**
 * 数组求交集
 */
export function intersection<T = any>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  return arrays.reduce((acc, cur) => acc.filter(item => cur.includes(item)));
}

export interface FormDataOptions {
  fileKey?: string;
  filter?: string[];
  handleFile?: (data: { file: File | Blob; key: string; formData: FormData }) => void;
}

/**
 * 对象转 FormData
 */
export function createFormData(data: Record<string, any>, options: FormDataOptions = {}): FormData {
  const formData = new FormData();
  const fileKey = options.fileKey || "file";
  const filter = options.filter || [];

  const append = (key: string, value: any) => {
    if (filter.includes(key)) return;
    if (options.handleFile && (value instanceof File || value instanceof Blob)) {
      options.handleFile({ file: value, key, formData });
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(fileKey, value, value instanceof File ? value.name : undefined);
    } else if (Array.isArray(value)) {
      value.forEach((v, index) => {
        append(`${key}[${index}]`, v);
      });
    } else if (isObject(value)) {
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
 * 解析 URL query 字符串为键值对象
 */
export function getQueryMap(url?: string): Record<string, string> {
  const targetUrl = url || (isClient ? window.location.href : "");
  if (!targetUrl || targetUrl.indexOf("?") === -1) return {};
  const queryPart = targetUrl.slice(targetUrl.indexOf("?") + 1);
  const pairs = queryPart.split("&");
  const result: Record<string, string> = {};
  for (const pair of pairs) {
    if (!pair) continue;
    const [key, value] = pair.split("=");
    if (key) {
      result[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }
  }
  return result;
}

/**
 * 解析 SVG 字符串的基础信息
 */
export function getSvgInfo(svgString: string): { width: number; height: number; body: string } {
  if (!isClient || !svgString) return { width: 0, height: 0, body: "" };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return { width: 0, height: 0, body: "" };
    const width = parseFloat(svg.getAttribute("width") || "0");
    const height = parseFloat(svg.getAttribute("height") || "0");
    return { width, height, body: svg.innerHTML };
  } catch {
    return { width: 0, height: 0, body: "" };
  }
}

/**
 * 转换时间秒数为 { h, m, s }
 */
export function getTime(seconds: number, padZero = true): { h: string | number; m: string | number; s: string | number } {
  const pad = (n: number) => {
    const floor = Math.floor(n);
    return floor < 10 && padZero ? `0${floor}` : floor;
  };
  const h = pad(seconds / 3600);
  const m = pad((seconds % 3600) / 60);
  const s = pad(seconds % 60);
  return { h, m, s };
}

/**
 * 在指定下标隐藏文字（例如敏感信息脱敏）
 */
export function hideTextAtIndex(
  str: string | number,
  index: number | number[] | { start: number; end: number },
  symbol = "*"
): string {
  let text = String(str);
  const chars = text.split("");

  if (isNumber(index)) {
    if (index >= 0 && index < chars.length) {
      chars[index] = symbol;
    }
  } else if (Array.isArray(index)) {
    index.forEach(i => {
      if (i >= 0 && i < chars.length) chars[i] = symbol;
    });
  } else if (isObject(index)) {
    const { start, end } = index as { start: number; end: number };
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
  return index === -1 ? str : str.substring(0, index);
}

/**
 * 截取分隔符之后的字符串
 */
export function subAfter(str: string, separator: string): string {
  if (typeof separator !== "string" || typeof str !== "string") return "";
  const index = str.indexOf(separator);
  return index === -1 ? "" : str.substring(index + separator.length);
}
