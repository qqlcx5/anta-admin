# Anta Admin 图标系统 (Icon System)

Anta Admin 提供了现代化的**统一图标系统**，彻底收敛为单一心智模型：以全局组件 `<AtIcon />`（或 `<at-icon />`）和高性能渲染 Hook `useRenderIcon` 为核心，融合了 **Iconify 海量在线/离线图标、unplugin-icons 编译期按需抽取、本地 SVG 组件化以及 Element Plus 官方图标**，消灭历史冗余与双重标准。

---

## 🌟 核心特性

- **单一心智模型**：模板排版统一使用 `<AtIcon />`，JS/TS/Element 属性统一使用 `useRenderIcon()`。
- **全局免引入**：已在入口全局注册 `<AtIcon />` 与 `<at-icon />`，在任何 `.vue` 页面中直接使用，零 import。
- **语法彻底归一**：统一遵循标准 Iconify 格式（如 `ep:edit`、`ri:search-line`），底层自动兼容旧格式（如 `ep/menu`）。
- **组件级缓存加速**：`useRenderIcon` 内置组件缓存池，消除菜单与列表渲染时频繁创建组件导致的 Virtual DOM 重绘与抖动。
- **纯净轻量**：彻底剥离传统 iconfont 字体包，告别首屏字体阻塞与冗余打包。

---

## 🚀 方式一：使用全局组件 `<AtIcon />`（推荐）

适合在普通页面排版、列表项、卡片或标题旁作为独立图标展示。

### 1. 基础用法
```vue
<template>
  <div class="flex items-center gap-4">
    <!-- 1. Iconify 标准图标（格式："集合:名称"） -->
    <AtIcon icon="ep:edit" />
    <AtIcon icon="ri:search-line" />
    <AtIcon icon="mdi:github" />

    <!-- 2. 离线/本地注册图标（自动兼容冒号与斜杠） -->
    <AtIcon icon="ep:menu" />

    <!-- 3. unplugin-icons 编译期抽取组件 -->
    <AtIcon :icon="MenuFold" />

    <!-- 4. 本地自定义 SVG 组件（vite-svg-loader） -->
    <AtIcon :icon="GlobalizationIcon" />

    <!-- 5. Element Plus 官方组件 -->
    <AtIcon :icon="Delete" />
  </div>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
import MenuFold from "~icons/ri/menu-fold-fill";
import GlobalizationIcon from "@/assets/svg/globalization.svg?component";
</script>
```

### 2. 结合 Tailwind CSS（推荐样式写法）
`<AtIcon />` 具备单根节点特性，所有 Tailwind 工具类、行内样式和 DOM 事件均会自动穿透生效：
```vue
<template>
  <!-- 尺寸与颜色控制 -->
  <AtIcon icon="ri:heart-3-fill" class="size-6 text-red-500 hover:scale-125 transition-transform cursor-pointer" />

  <!-- 随 Element Plus 主题色与暗黑模式联动 -->
  <AtIcon icon="ep:setting" class="size-5 text-primary" />
</template>
```

### 3. 组件 Props 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `icon` | `string \| Component \| Function \| object` | `-` | **必填**。图标标识、组件对象、SVG 字符串或图片 URL |
| `size` | `number \| string` | `-` | 图标尺寸（支持纯数值如 `20`，或带单位字串如 `"18px"`, `"1.5rem"`） |
| `color` | `string` | `-` | 图标颜色（支持 CSS 颜色名、十六进制或 CSS 变量） |
| `inline`| `boolean` | `false` | 是否内联居中对齐展示 |
| `rotate`| `number \| string` | `-` | 旋转角度（如 `90`, `180`） |

---

## 🎯 方式二：使用 `useRenderIcon` 函数

适合需要将图标直接传递给 **Element Plus 组件的属性**（如 `<el-button :icon="...">`），或在 **动态路由配置（`route.meta.icon`）** 中使用。

```vue
<template>
  <!-- 按钮前置图标 -->
  <el-button type="primary" :icon="useRenderIcon('ep:search')">搜索</el-button>
  <el-button type="danger" :icon="useRenderIcon(Delete)">删除</el-button>

  <!-- 输入框前缀图标 -->
  <el-input :prefix-icon="useRenderIcon('ri:user-line')" placeholder="请输入用户名" />

  <!-- 动态组件挂载 -->
  <component :is="useRenderIcon('mdi:alarm')" class="size-5 text-orange-400" />
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
import { useRenderIcon } from "@/components/ReIcon";
</script>
```

---

## 📦 图标来源与接入规范

### 1. Iconify 标准图标（开发首选）
- **格式**：`[集合前缀]:[图标名]`（例如 `ep:plus`、`ri:user-line`、`mdi:bell-ring`）。
- **挑选地址**：访问 [Iconify 图标中心](https://icon-sets.iconify.design/) 检索 20 万+ 开源图标。
- **优点**：无需安装或下载任何文件，直接在代码中输入名称即可使用。

### 2. 静态离线图标（内网/专网首选）
对于专网/内网环境，系统基础菜单图标已在 `src/components/ReIcon/src/offlineIcon.ts` 中通过 `unplugin-icons` 统一抽取。
若需新增静态菜单图标：
```ts
// src/components/ReIcon/src/offlineIcon.ts
import EpDownload from "~icons/ep/download?raw";

const icons = [
  // ...
  ["ep:download", EpDownload]
];
```
系统会自动同时注册 `ep:download` 与 `ep/download`，无需区分语法。

### 3. 本地自定义 SVG（`vite-svg-loader`）
- **存放路径**：`src/assets/svg/`
- **使用方式**：带上 `?component` 后缀作为 Vue 组件导入：
  ```vue
  <script setup lang="ts">
  import MyLogo from "@/assets/svg/logo.svg?component";
  </script>

  <template>
    <AtIcon :icon="MyLogo" class="size-8 text-primary" />
  </template>
  ```

### 4. Element Plus 官方图标
- **依赖库**：`@element-plus/icons-vue`
- **使用方式**：直接导入图标组件对象并传入 `:icon`。

---

## 💡 最佳实践

1. **页面模板排版**：优先使用 `<AtIcon icon="ep:xxx" />`，配合 Tailwind CSS 类名控制大小和交互效果。
2. **Element Plus 组件绑定**：使用 `useRenderIcon('ep:xxx')` 绑定到 `:icon` / `:prefix-icon`。
3. **后台路由配置**：在路由 meta 中声明 `icon: "ep:user"` 或 `icon: "ri:dashboard-line"`。
