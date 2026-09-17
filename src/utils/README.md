# Anta Admin 本地工具库 (Local Utilities)

本项目已将所有通用工具函数与 Hooks 完全本地化至 `src/utils`，摆脱了对外部 `@pureadmin/utils` 的依赖，便于企业级项目根据自身需求灵活扩展与维护。

### 模块结构说明

- **`is.ts`**: 类型与数据校验（`is`, `isArray`, `isObject`, `isFunction`, `isEmpty`, `isAllEmpty`, `isEqual`, `isPhone`, `isEmail`, `isUrl` 等）
- **`clone.ts`**: 数据深浅拷贝（`clone`, `cloneDeep`）
- **`dom.ts`**: DOM 操作、剪贴板、元素监听与水印（`addClass`, `removeClass`, `hasClass`, `toggleClass`, `openLink`, `copyTextToClipboard`, `useCopyToClipboard`, `useResizeObserver`, `useWatermark`）
- **`color.ts`**: 颜色计算与渐变处理（`darken`, `lighten`, `randomGradient`, `hexToRgb`, `rgbToHex`, `randomColor`）
- **`storage.ts`**: 本地与会话存储封装（`storageLocal`, `storageSession`）
- **`tools.ts`**: 常用开发与格式化工具（`debounce`, `throttle`, `delay`, `deviceDetection`, `formatBytes`, `sum`, `getKeyList`, `delObjectProperty`, `extractFields`, `intersection`, `createFormData`, `getQueryMap`, `getSvgInfo`, `getTime`, `hideTextAtIndex`, `subBefore`, `subAfter`）
- **`download.ts`**: 文件下载（`downloadByBase64`, `downloadByData`, `downloadByOnlineUrl`, `downloadByUrl`）
- **`withInstall.ts`**: Vue 组件快速安装（`withInstall`, `withInstallFunction`, `withNoopInstall`）
- **`hooks.ts`**: Vue 常用组合式 API（`useDark`, `useGlobal`, `useECharts`, `useLoader`）
- **`auth.ts`**: Token 与权限认证工具
- **`message.ts`**: 消息提示封装
- **`tree.ts`**: 树形结构数据处理
- **`mitt.ts`**: 全局事件总线

所有方法均可通过 `@/utils` 统一导入使用：
```ts
import { cloneDeep, isAllEmpty, debounce, useDark } from "@/utils";
```
