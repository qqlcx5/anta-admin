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
import { isClient, isWindow } from "@vueuse/core";

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
  isClient,
  isWindow
};

export const isServer = !isClient;

export function is(val: unknown, type: string): boolean {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

export const isDef = <T = unknown>(val?: T): val is T => typeof val !== "undefined";
export const isUnDef = <T = unknown>(val?: T): val is T => typeof val === "undefined";
export const isNull = (val: unknown): val is null => val === null;
export const isNullAndUnDef = (val: unknown): val is null | undefined =>
  val === null || typeof val === "undefined";
export const isNullOrUnDef = isNullAndUnDef;

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    val instanceof Promise ||
    (isObject(val) && isFunction((val as any).then) && isFunction((val as any).catch))
  );
};

export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!(val as any).tagName;
};

export const hasOwnProp = (obj: any, key: string | symbol): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

export const isEqualArray = (arr1: any[], arr2: any[]): boolean => isEqual(arr1, arr2);
export const isEqualObject = (obj1: any, obj2: any): boolean => isEqual(obj1, obj2);

export const isPhone = (val: string): boolean => /^1[3-9]\d{9}$/.test(val);
export const isEmail = (val: string): boolean => /^[\w.-]+@[\w.-]+\.\w+$/.test(val);
export const isUrl = (val: string): boolean =>
  /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(val);

export const isAllEmpty = (val: any): boolean =>
  isEmpty(val) || val === null || val === undefined;

export const isIncludeAllChildren = (child: any[], parent: any[]): boolean => {
  if (!Array.isArray(child) || !Array.isArray(parent)) return false;
  return child.every(item => parent.some(p => isEqual(item, p)));
};
