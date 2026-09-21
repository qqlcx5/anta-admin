import type { iconType } from "./types";
import { h, defineComponent, isVNode, type Component } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue";

const svgReg = /^\s*<svg[\s>]/;
const svgCache = new Map<string, string>();
const imgReg = /^(https?:\/\/|\/\/|data:image\/)/;
const componentCache = new Map<string, Component>();

/**
 * 针对原始 SVG 字符串的深度 XSS 安全过滤
 */
function sanitizeSvg(rawSvg: string): string {
  return rawSvg
    // 移除 <script> 标签及内部脚本
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // 移除 <foreignObject>（常用于在 SVG 中嵌入 HTML/JS 执行 XSS）
    .replace(
      /<foreignObject\b[^<]*(?:(?!<\/foreignObject>)<[^<]*)*<\/foreignObject>/gi,
      ""
    )
    // 移除 <iframe>、<object>、<embed>
    .replace(
      /<(?:iframe|object|embed)\b[^<]*(?:(?!<\/(?:iframe|object|embed)>)<[^<]*)*<\/(?:iframe|object|embed)>/gi,
      ""
    )
    // 移除所有内联 on* 事件监听器（如 onload, onerror, onclick）
    .replace(/\bon[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "")
    // 移除 javascript: 伪协议
    .replace(
      /href\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi,
      ""
    )
    // 移除宽高属性，由外层容器或样式统一控制
    .replace(/<svg([^>]*)>/i, (_, attrs) => `<svg${attrs.replace(/\s*(width|height)="[^"]*"/gi, "")}>`);
}

/**
 * 统一图标渲染函数
 * 支持 Iconify 在线/离线字符串、本地 SVG 字符串、Vue/SVG 组件、图片 URL 等
 *
 * @param icon 必传 图标标识或组件
 * @param attrs 可选 iconType 属性
 * @returns Component
 */
export function useRenderIcon(icon: any, attrs?: iconType): Component {
  if (!icon) return defineComponent({ render: () => null });

  // 1. 如果本身就是函数式组件
  if (typeof icon === "function") {
    return defineComponent({
      name: "FunctionIcon",
      render() {
        return h(icon, { ...attrs, ...this.$attrs });
      }
    });
  }

  // 2. 如果是 Vue 组件对象（如 Element Plus 图标、unplugin-icons 组件、SVG 组件对象）
  if (typeof icon === "object") {
    if (isVNode(icon)) {
      return defineComponent({
        name: "VNodeIcon",
        render: () => icon
      });
    }
    return defineComponent({
      name: "CustomComponentIcon",
      render() {
        return h(icon, { ...attrs, ...this.$attrs });
      }
    });
  }

  // 3. 字符串类型（SVG 字符串、图片 URL、Iconify 字符串）
  if (typeof icon === "string") {
    const trimmed = icon.trim();
    if (!trimmed) return defineComponent({ render: () => null });

    // 3.1 原始 SVG 字符串（带安全过滤）
    if (svgReg.test(trimmed)) {
      let cleanedSvg = svgCache.get(trimmed);
      if (cleanedSvg === undefined) {
        if (svgCache.size > 200) svgCache.clear();
        cleanedSvg = sanitizeSvg(trimmed);
        svgCache.set(trimmed, cleanedSvg);
      }
      return defineComponent({
        name: "SvgRawIcon",
        render() {
          return h("span", {
            class: "svg-raw-icon inline-flex items-center justify-center",
            innerHTML: cleanedSvg,
            ...attrs,
            ...this.$attrs
          });
        }
      });
    }

    // 3.2 图片 URL
    if (imgReg.test(trimmed)) {
      return defineComponent({
        name: "ImgIcon",
        render() {
          return h("img", {
            src: trimmed,
            style: {
              width: "1em",
              height: "1em",
              objectFit: "contain"
            },
            ...attrs,
            ...this.$attrs
          });
        }
      });
    }

    // 3.3 Iconify 标识（标准化格式，冒号为主，自动兼容斜杠）
    const normalizedIcon =
      trimmed.includes("/") && !trimmed.includes(":")
        ? trimmed.replace("/", ":")
        : trimmed;

    // 纯粹以 normalizedIcon 为 key 缓存基础组件，避免由 attrs 引起的 JSON.stringify 异常或闭包污染
    let BaseComp = componentCache.get(normalizedIcon);
    if (!BaseComp) {
      BaseComp = defineComponent({
        name: "AtIconRender",
        render() {
          return h(
            IconifyIcon as any,
            {
              icon: normalizedIcon,
              "aria-hidden": false,
              style: { outline: "none" },
              ...this.$attrs
            },
            {
              default: () => []
            }
          );
        }
      });
      if (componentCache.size > 500) componentCache.clear();
      componentCache.set(normalizedIcon, BaseComp);
    }

    // 若无外部静态 attrs，直接返回缓存的单例组件，实现绝对复用与 0 额外开销
    if (!attrs || Object.keys(attrs).length === 0) {
      return BaseComp;
    }

    // 若存在特定 attrs（如在 Element 按钮等特殊位置单独传入配置），包装一层以干净透传
    return defineComponent({
      name: "AtIconRenderWithAttrs",
      render() {
        return h(BaseComp!, { ...attrs, ...this.$attrs });
      }
    });
  }

  return defineComponent({ render: () => null });
}

