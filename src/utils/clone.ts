import { clone as _clone, cloneDeep } from "lodash-es";

export { cloneDeep };

/**
 * 拷贝对象
 * @param target 目标对象
 * @param deep 是否深拷贝，默认 false 为浅拷贝，true 为深拷贝
 */
export const clone = <T>(target: T, deep = false): T => {
  return deep ? cloneDeep(target) : _clone(target);
};
