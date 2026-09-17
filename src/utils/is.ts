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
  isEmpty
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
  isEmpty,
  isClient
};

export const isServer = !isClient;

export function is(val: unknown, type: string): boolean {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

export const isWindow = (val: any): val is Window =>
  typeof window !== "undefined" && Object.prototype.toString.call(val) === "[object Window]";

export const isDef = <T = unknown>(val?: T): val is T => typeof val !== "undefined";
export const isUnDef = <T = unknown>(val?: T): val is T => typeof val === "undefined";
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

export const isEqualArray = (arr1: any[], arr2: any[]): boolean => isEqual(arr1, arr2);
export const isEqualObject = (obj1: any, obj2: any): boolean => isEqual(obj1, obj2);

export const isPhone = (val: string): boolean => /^1[3-9]\d{9}$/.test(val);
export const isEmail = (val: string): boolean => /^[\w.-]+@[\w.-]+\.\w+$/.test(val);
export const isUrl = (val: string): boolean =>
  /^(?:(https?|ftp|rtsp|mms|ws|wss):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:localhost)|(?:[1-9]\d{0,2}(?:\.\d{1,3}){3})|(?:\[[0-9a-fA-F:]+\])|(?:(?:[a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,63}))(?::\d{1,5})?(?:[/?#]\S*)?$/i.test(
    val
  );

/**
 * 判断参数是否为空
 * null / undefined / 空数组 / 空对象 / 空字符串 / 空Map / 空Set 返回 true
 * 关键点：0 和 false 为有效数据，不视为空（避免 lodash.isEmpty(0) === true 破坏路由序号等数值逻辑）
 * 支持传单个值或多个值（多个值时全部为空才返回 true）
 */
export const isAllEmpty = (...vals: any[]): boolean => {
  if (vals.length === 0) return true;
  return vals.every(
    val =>
      val === null ||
      val === undefined ||
      (typeof val === "number"
        ? Number.isNaN(val)
        : typeof val === "boolean"
          ? false
          : isEmpty(val))
  );
};

export const isIncludeAllChildren = (child: any[], parent: any[]): boolean => {
  if (!Array.isArray(child) || !Array.isArray(parent)) return false;
  return child.every(item => parent.some(p => isEqual(item, p)));
};

export const isBase64 = (str: string): boolean => {
  if (!str || typeof str !== "string" || str.trim() === "") return false;
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};
