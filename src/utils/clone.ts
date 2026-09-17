import { isObject } from "./is";

/**
 * 浅拷贝
 */
export function clone<T>(target: T): T {
  if (!isObject(target)) return target;
  if (Array.isArray(target)) return [...target] as unknown as T;
  return { ...target };
}

/**
 * 深拷贝
 */
export function cloneDeep<T>(target: T, hash = new WeakMap()): T {
  if (target === null || typeof target !== "object") {
    return target;
  }

  if (target instanceof Date) return new Date(target.getTime()) as any;
  if (target instanceof RegExp) return new RegExp(target.source, target.flags) as any;
  if (typeof (target as any).cloneNode === "function") {
    return (target as any).cloneNode(true);
  }

  if (hash.has(target as any)) {
    return hash.get(target as any);
  }

  if (target instanceof Map) {
    const result = new Map();
    hash.set(target as any, result);
    target.forEach((val, key) => {
      result.set(key, cloneDeep(val, hash));
    });
    return result as any;
  }

  if (target instanceof Set) {
    const result = new Set();
    hash.set(target as any, result);
    target.forEach(val => {
      result.add(cloneDeep(val, hash));
    });
    return result as any;
  }

  if (Array.isArray(target)) {
    const result: any[] = [];
    hash.set(target, result);
    for (let i = 0; i < target.length; i++) {
      result[i] = cloneDeep(target[i], hash);
    }
    return result as any;
  }

  const result = Object.create(Object.getPrototypeOf(target));
  hash.set(target as any, result);

  const keys = Reflect.ownKeys(target as any);
  for (const key of keys) {
    result[key] = cloneDeep((target as any)[key], hash);
  }

  return result;
}
