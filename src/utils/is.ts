import {
  isObject,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isRegExp,
  isArray,
  isDate,
  isEqual,
  isEmpty as _isEmpty
} from "lodash-es";
import { isClient } from "@vueuse/core";

export {
  isObject,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isRegExp,
  isArray,
  isDate,
  isEqual,
  isClient
};

export const isServer = !isClient;

export function is(val: unknown, type: string): boolean {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

export const isWindow = (val: any): val is Window =>
  typeof window !== "undefined" &&
  Object.prototype.toString.call(val) === "[object Window]";

export const isDef = <T = unknown>(val?: T): val is NonNullable<T> =>
  typeof val !== "undefined";
export const isUnDef = (val: unknown): val is undefined =>
  typeof val === "undefined";
export const isNull = (val: unknown): val is null => val === null;
export const isNullAndUnDef = (val: unknown): val is null | undefined =>
  val === null || typeof val === "undefined";
export const isNullOrUnDef = isNullAndUnDef;

export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  val instanceof Promise || (isObject(val) && isFunction((val as any).then));

export const isElement = (val: unknown): val is Element =>
  isObject(val) && !!(val as any).tagName;

export const hasOwnProp = (obj: any, key: string | symbol): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

export const isEqualArray = (arr1: any[], arr2: any[]): boolean =>
  isEqual(arr1, arr2);
export const isEqualObject = (obj1: any, obj2: any): boolean =>
  isEqual(obj1, obj2);

export const isPhone = (val: unknown): boolean =>
  typeof val === "string" && /^1[3-9]\d{9}$/.test(val);
export const isEmail = (val: unknown): boolean =>
  typeof val === "string" && /^[\w.-]+@[\w.-]+\.\w+$/.test(val);

/**
 * 判断是否为网络绝对路径/外链（要求显式包含 http://、https:// 或 ftp:// 协议）
 * 严格防止形如 "user.profile" 的路由标识被误判为外链
 */
export const isUrl = (val: unknown): boolean => {
  if (typeof val !== "string") return false;
  return /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(val);
};

/**
 * 严格判断值是否为空（工业级防线）
 * - null / undefined -> true
 * - 0 / 0.0 / -0 / 负数 -> false (有效数值，不为空)
 * - NaN -> true
 * - true / false -> false (有效布尔值，不为空)
 * - 函数、组件、RegExp -> false (非空)
 * - Date -> 有效日期为 false，无效日期 (NaN) 为 true
 * - Error -> 消息为空时为 true
 * - 纯空白字符串 ("   ") -> true
 * - 空数组 [] / 空集合 Set / 空字典 Map -> true
 * - 空对象 {} -> true (由 lodash-es isEmpty 兜底)
 */
export function isEmpty<T = unknown>(val: T): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === "boolean") return false;
  if (typeof val === "number") return Number.isNaN(val);
  if (typeof val === "function") return false;
  if (typeof val === "string") return val.trim().length === 0;
  if (val instanceof Date) return Number.isNaN(val.getTime());
  if (val instanceof RegExp) return false;
  if (val instanceof Error) return val.message.trim().length === 0;
  if (Array.isArray(val)) return val.length === 0;
  if (val instanceof Map || val instanceof Set) return val.size === 0;
  return _isEmpty(val);
}

/**
 * 判断所有参数是否为空
 * null / undefined / 空数组 / 空对象 / 空字符串 / 空Map / 空Set 返回 true
 * 关键点：0 和 false 为有效数据，不视为空（避免 lodash.isEmpty(0) === true 破坏路由序号等数值逻辑）
 * 支持传单个值或多个值（多个值时全部为空才返回 true，无参时返回 true）
 */
export const isAllEmpty = (...vals: any[]): boolean => {
  if (vals.length === 0) return true;
  return vals.every(val => isEmpty(val));
};

export const isIncludeAllChildren = (child: any[], parent: any[]): boolean => {
  if (!Array.isArray(child) || !Array.isArray(parent)) return false;
  return child.every(item => parent.some(p => isEqual(item, p)));
};

export const isBase64 = (str: unknown): boolean => {
  if (typeof str !== "string" || str.trim() === "") return false;
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};
