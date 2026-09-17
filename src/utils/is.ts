const toString = Object.prototype.toString;

export function is(val: unknown, type: string): boolean {
  return toString.call(val) === `[object ${type}]`;
}

export const isDef = <T = unknown>(val?: T): val is T => typeof val !== "undefined";
export const isUnDef = <T = unknown>(val?: T): val is T => !isDef(val);

export const isObject = (val: any): val is Record<any, any> =>
  val !== null && is(val, "Object");

export const isEmpty = <T = unknown>(val: T): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === "boolean") return false;
  if (typeof val === "number") return false;
  if (val instanceof Error) return val.message === "";
  if (Array.isArray(val)) return !val.length;
  if (val instanceof Map || val instanceof Set) return !val.size;
  if (typeof val === "object") return !Object.keys(val).length;
  if (typeof val === "string") return val.trim().length === 0;
  return false;
};

export const isDate = (val: unknown): val is Date => is(val, "Date");
export const isNull = (val: unknown): val is null => val === null;
export const isNullAndUnDef = (val: unknown): val is null | undefined =>
  isUnDef(val) && isNull(val);
export const isNullOrUnDef = (val: unknown): val is null | undefined =>
  isUnDef(val) || isNull(val);
export const isNumber = (val: unknown): val is number => is(val, "Number");
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    is(val, "Promise") &&
    isObject(val) &&
    isFunction((val as any).then) &&
    isFunction((val as any).catch)
  );
};
export const isString = (val: unknown): val is string => is(val, "String");
export const isFunction = (val: unknown): val is Function =>
  typeof val === "function";
export const isBoolean = (val: unknown): val is boolean => is(val, "Boolean");
export const isRegExp = (val: unknown): val is RegExp => is(val, "RegExp");
export const isArray = (val: any): val is Array<any> =>
  Boolean(val) && Array.isArray(val);
export const isWindow = (val: any): val is Window =>
  typeof window !== "undefined" && is(val, "Window");
export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!(val as any).tagName;
};
export const isClient = typeof window !== "undefined";
export const isServer = !isClient;

export function hasOwnProp(obj: any, key: string | symbol): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isEqual(x: any, y: any): boolean {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  }
  if (x !== x) {
    return y !== y;
  }
  if (!x || !y) return false;
  const typeX = typeof x;
  const typeY = typeof y;
  if (typeX !== typeY) return false;
  if (typeX !== "object" && typeX !== "function") return false;

  const className = toString.call(x);
  if (className !== toString.call(y)) return false;

  switch (className) {
    case "[object RegExp]":
    case "[object String]":
      return "" + x === "" + y;
    case "[object Number]":
      if (+x !== +x) return +y !== +y;
      return +x === 0 ? 1 / +x === 1 / y : +x === +y;
    case "[object Date]":
    case "[object Boolean]":
      return +x === +y;
    case "[object Symbol]":
      return Symbol.prototype.valueOf.call(x) === Symbol.prototype.valueOf.call(y);
  }

  const areArrays = className === "[object Array]";
  if (!areArrays) {
    if (typeof x !== "object" || typeof y !== "object") return false;
    const ctorX = x.constructor;
    const ctorY = y.constructor;
    if (
      ctorX !== ctorY &&
      !(
        isFunction(ctorX) &&
        ctorX instanceof ctorX &&
        isFunction(ctorY) &&
        ctorY instanceof ctorY
      ) &&
      "constructor" in x &&
      "constructor" in y
    ) {
      return false;
    }
  }

  if (areArrays) {
    let length = x.length;
    if (length !== y.length) return false;
    while (length--) {
      if (!isEqual(x[length], y[length])) return false;
    }
    return true;
  }

  const keys = Object.keys(x);
  let length = keys.length;
  if (Object.keys(y).length !== length) return false;
  while (length--) {
    const key = keys[length];
    if (!(hasOwnProp(y, key) && isEqual(x[key], y[key]))) return false;
  }
  return true;
}

export const isEqualArray = (arr1: any[], arr2: any[]): boolean =>
  isEqual(arr1, arr2);
export const isEqualObject = (obj1: any, obj2: any): boolean =>
  isEqual(obj1, obj2);

export const isPhone = (val: string): boolean =>
  /^1[3-9]\d{9}$/.test(val);

export const isEmail = (val: string): boolean =>
  /^[\w.-]+@[\w.-]+\.\w+$/.test(val);

export const isUrl = (val: string): boolean =>
  /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(val);

export const isAllEmpty = (val: any): boolean =>
  isEmpty(val) || val === null || val === undefined;

export const isIncludeAllChildren = (child: any[], parent: any[]): boolean => {
  if (!Array.isArray(child) || !Array.isArray(parent)) return false;
  return child.every(item => parent.some(p => isEqual(item, p)));
};

export const isBase64 = (str: string): boolean => {
  if (str === "" || str.trim() === "") return false;
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};
