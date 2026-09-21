import AtIcon from "./src/AtIcon.vue";
import { useRenderIcon } from "./src/hooks";

/** 全局图标组件与渲染 Hook */
export { AtIcon, useRenderIcon };
export const atIcon = AtIcon;

/** 向后兼容别名导出（直接映射到统一的 AtIcon） */
export const IconifyIconOffline = AtIcon;
export const IconifyIconOnline = AtIcon;
export const FontIcon = AtIcon;

export default AtIcon;
