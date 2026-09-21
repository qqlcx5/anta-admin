# Anta Admin 本地工具库 (Local Utilities)

本项目已将所有通用工具函数与 Hooks 完全本地化至 `src/utils`，**彻底摆脱了对外部 `@pureadmin/utils` 的依赖**，基于 **`lodash-es` + `@vueuse/core` + 现代原生 Web API** 构建，支持极致 Tree-shaking 且无任何厂商锁定。

所有方法均可通过 `@/utils` 统一导入使用：

```ts
import {
  cloneDeep,
  isAllEmpty,
  debounce,
  throttle,
  useDark,
  useWatermark
} from "@/utils";
```

---

## 📚 模块详细 API 指南

### 1. `clone.ts` 数据拷贝

基于 `lodash-es` 高性能封装，天然支持循环引用与函数属性保留：

```ts
import { clone, cloneDeep } from "@/utils";

// 浅拷贝
const shallow = clone(target);
// 深拷贝（支持布尔传参兼容习惯）
const deep1 = clone(target, true);
const deep2 = cloneDeep(target);
```

---

### 2. `is.ts` 类型与边界校验

直接复用 `lodash-es` 的标准校验，并对关键业务边界进行了防御性加固：

```ts
import {
  isAllEmpty,
  isEmpty,
  isEqual,
  isObject,
  isArray,
  isFunction,
  isUrl,
  isPhone,
  isEmail,
  isBase64,
  isClient
} from "@/utils";

// 关键防御：isEmpty / isAllEmpty 严格保护数值、布尔值、日期、函数与空白字符串
isEmpty(0); // false (0 为有效数值，非空)
isEmpty(false); // false (false 为有效布尔值，非空)
isEmpty(new Date()); // false (有效日期，非空)
isEmpty(() => {}); // false (函数组件/回调，非空)
isEmpty("   "); // true  (空白字符视为空)
isAllEmpty(0); // false
isAllEmpty(false); // false
isAllEmpty(NaN); // true
isAllEmpty(""); // true
isAllEmpty([], {}); // true (支持多参数，全部为空返回 true)
isAllEmpty(null, 0); // false

// 格式与外链校验（isUrl 严格要求 http/https/ftp 协议，避免把 user.profile 等路由名识别为外链）
isUrl("https://github.com"); // true
isUrl("user.profile"); // false
isPhone("13800138000"); // true
isEmail("test@anta.com"); // true
```

---

### 3. `tools.ts` 常用工具函数

```ts
import {
  debounce,
  throttle,
  delay,
  formatBytes,
  deviceDetection,
  createFormData,
  getQueryMap,
  delObjectProperty,
  extractFields
} from "@/utils";

// 防抖（兼容 immediate 布尔参数）
const onSearch = debounce(() => doSearch(), 300);
const onInstant = debounce(() => doSubmit(), 300, true); // 首次立即执行

// 节流
const onScroll = throttle(() => handleScroll(), 200);

// 延时异步
await delay(500);

// 字节格式化
formatBytes(1048576); // "1 MB"

// 设备检测
const isMobile = deviceDetection(); // boolean

// URL 参数解析
const params = getQueryMap("https://domain.com?id=1&name=anta"); // { id: "1", name: "anta" }

// 从对象中剔除属性
const cleanObj = delObjectProperty({ a: 1, b: 2, c: 3 }, ["a", "b"]); // { c: 3 }

// 从列表抽取指定字段
const subset = extractFields(userList, "id", "name");
```

---

### 4. `dom.ts` DOM 操作、剪贴板与水印

```ts
import {
  useResizeObserver,
  useWatermark,
  copyTextToClipboard,
  useCopyToClipboard,
  toggleClass,
  addClass,
  removeClass
} from "@/utils";

// 1. 元素尺寸变化监听（复用 @vueuse/core，支持 DOM、Ref 或选择器字符串）
useResizeObserver(containerRef, entries => {
  console.log("容器尺寸变动:", entries[0].contentRect);
});

// 2. 水印功能
const { setWatermark, clear } = useWatermark();
setWatermark("Anta Admin 保密信息", { color: "rgba(0, 0, 0, 0.15)" });
// clear(); // 清除水印

// 3. 剪贴板复制
copyTextToClipboard("复制的内容");

// 4. Hook 方式复制（带 1.5s 状态提示）
const { copied, update } = useCopyToClipboard();
update("点击复制");
```

---

### 5. `hooks.ts` 组合式 API

```ts
import { useDark, useGlobal, useECharts, useLoader } from "@/utils";

// 1. 暗黑模式监听（纯状态响应，已阻断与系统 themeMode 的 localStorage 竞态）
const { isDark, toggleDark } = useDark();

// 2. 获取 Vue 全局挂载实例属性
const { $storage, $config, $echarts } = useGlobal();

// 3. ECharts 管理 Hook（响应式重绘、主题联动、尺寸自适应）
const chartRef = ref<HTMLDivElement>();
const { setOptions, resize, showLoading, hideLoading } = useECharts(chartRef);

// 4. 动态资源加载器
const { loadScript, loadCss } = useLoader();
await loadScript("https://cdn.jsdelivr.net/.../lib.js");
```

---

### 6. `color.ts` 颜色计算

```ts
import {
  darken,
  lighten,
  hexToRgb,
  rgbToHex,
  randomColor,
  randomGradient
} from "@/utils";

darken("#409eff", 0.2); // 颜色加深 20%（level 为 0~1 小数；传 20 会得到非法颜色）
lighten("#409eff", 0.2); // 颜色变浅 20%（level 为 0~1 小数）
randomColor(); // 随机 Hex 颜色
randomGradient(); // 随机线性渐变 CSS 样式
```

---

### 7. `download.ts` 文件下载

```ts
import {
  downloadByUrl,
  downloadByData,
  downloadByBase64,
  downloadByOnlineUrl
} from "@/utils";

// 通过在线链接或接口地址下载
downloadByUrl({ url: "/api/export/excel", fileName: "报表.xlsx" });

// 通过 Blob 或二进制数据下载
downloadByData(blobData, "导出数据.csv", "text/csv");

// 通过 Base64 下载
downloadByBase64(base64Str, "图片.png");
```

---

### 8. `storage.ts` 本地存储包装

内置统一带有命名空间缓存管理的本地与会话存储服务：

```ts
import { storageLocal, storageSession } from "@/utils";

storageLocal().setItem("token", "xxxx");
const token = storageLocal().getItem("token");
storageLocal().removeItem("token");
storageLocal().clear();
```
