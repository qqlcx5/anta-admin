<script setup lang="ts">
import { computed, useAttrs, type CSSProperties, type Component } from "vue";
import { useRenderIcon } from "./hooks";

defineOptions({
  name: "AtIcon",
  inheritAttrs: false
});

const props = withDefaults(
  defineProps<{
    /** 图标标识：支持 Iconify 标识（如 ep:edit、ri:search-line）、离线名称（如 ep/menu）、Vue组件、SVG、图片URL等 */
    icon?: any;
    /** 图标大小（支持数值如 20，或带单位字符串如 "18px"、"1.5rem"） */
    size?: number | string;
    /** 图标颜色 */
    color?: string;
    /** 是否内联展示 */
    inline?: boolean;
    /** 旋转角度（如 90、180） */
    rotate?: number | string;
  }>(),
  {
    icon: undefined,
    size: undefined,
    color: undefined,
    inline: false,
    rotate: undefined
  }
);

const attrs = useAttrs();

// 计算尺寸与颜色样式
const iconStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};

  if (props.size !== undefined && props.size !== "") {
    const s = typeof props.size === "number" ? `${props.size}px` : props.size;
    style.fontSize = s;
    style.width = s;
    style.height = s;
  }

  if (props.color) {
    style.color = props.color;
  }

  if (props.rotate !== undefined) {
    const deg =
      typeof props.rotate === "number" ? `${props.rotate}deg` : props.rotate;
    style.transform = `rotate(${deg})`;
  }

  if (props.inline) {
    style.display = "inline-flex";
    style.verticalAlign = "middle";
  }

  return style;
});

// 动态解析图标组件
const iconComponent = computed<Component | null>(() => {
  if (!props.icon || (typeof props.icon === "string" && !props.icon.trim()))
    return null;
  return useRenderIcon(props.icon);
});
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    v-bind="attrs"
    :style="[iconStyle, attrs.style as any]"
  />
</template>
