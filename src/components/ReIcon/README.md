# Anta Admin 图标系统 (Icon System)

Anta Admin 内置了一套**全能混合图标体系**，融合了 **Iconify 海量在线图标、编译期离线提取、本地 SVG 组件化、Element Plus 官方图标以及 iconfont 阿里矢量库**，并通过统一的全局组件 `<AtIcon />` 与核心渲染函数 `useRenderIcon` 实现了统一规范化调用。

---

## 🌟 核心特性

- **全局免引入**：已在入口全局注册 `<AtIcon />` 与 `<at-icon />`，在任何 `.vue` 页面中直接使用，零 import。
- **类似 UnoCSS 的极致体验**：在模板中通过 `icon="集合:图标名"` 自由指定图标，天然支持 Tailwind CSS 工具类。
- **双轨制架构**：
  - **外网环境**：在线按需加载（20万+ 图标免下载，初始打包增量为 **0 KB**）。
  - **内网/专网环境**：通过 `offlineIcon.ts` 结合 `unplugin-icons` 进行编译期抽取，离线打包单个仅需 300 字节。
- **全场景兼容**：无论是模板排版、Element Plus 按钮/表单属性（`:icon`），还是后端动态返回的路由菜单，均可 100% 渲染。

---

## 🚀 方式一：使用全局组件 `<AtIcon />`（推荐）

适合在普通页面排版、列表项、卡片或标题旁作为独立图标展示。

### 1. 基础用法
```vue
<template>
  <div class="flex items-center gap-4">
    <!-- Iconify 在线图标（格式："集合:名称"） -->
    <AtIcon icon="ep:edit" />
    <AtIcon icon="ri:search-line" />
    <AtIcon icon="mdi:github" />

    <!-- 离线本地注册图标（格式："集合/名称"） -->
    <AtIcon icon="ep/menu" />

    <!-- iconfont 阿里矢量图标（前缀："IF-"） -->
    <AtIcon icon="IF-pure-iconfont-wechat" />

    <!-- Element Plus 官方组件或本地 SVG 组件 -->
    <AtIcon :icon="Delete" />
  </div>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
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
| `icon` | `string \| Component \| Function \| object` | `-` | **必填**。图标标识或组件对象 |
| `size` | `number \| string` | `-` | 图标尺寸（支持纯数值如 `20`，或带单位字串如 `"18px"`, `"1.5rem"`） |
| `color` | `string` | `-` | 图标颜色（支持 CSS 颜色名、十六进制或 CSS 变量） |
| `inline`| `boolean` | `false` | 是否内联居中对齐展示 |
| `rotate`| `number \| string` | `-` | 旋转角度（如 `90`, `180`） |

---

## 🎯 方式二：使用 `useRenderIcon` 函数

适合需要将图标直接传递给 **Element Plus 组件的属性**（如 `<el-button :icon="...">`），或在 **路由配置（`route.meta.icon`）** 中使用。

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
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
</script>
```

---

## 📦 五大图标来源与接入规范

### 1. Iconify 在线图标（外网首选）
- **格式**：`[集合前缀]:[图标名]`（例如 `ep:plus`、`ri:user-line`、`mdi:bell-ring`）。
- **挑选地址**：访问 [Iconify 图标中心](https://icon-sets.iconify.design/) 搜索获取。
- **优点**：无需安装或下载任何文件，直接在代码中输入名称即可使用。

### 2. Iconify 离线本地图标（政企专网首选）
- **格式**：`[集合前缀]/[图标名]`（例如 `ep/menu`、`ri/mind-map`）。
- **离线注册步骤**：在 `src/components/ReIcon/src/offlineIcon.ts` 中添加：
  ```ts
  import EpDownload from "~icons/ep/download?raw";

  // 添加至 icons 数组中
  const icons = [
    // ...
    ["ep/download", EpDownload]
  ];
  ```
- **优点**：由 `unplugin-icons` 在打包时精准切出该 SVG 代码，内网离线环境 100% 正常显示。

### 3. 本地自定义 SVG（`vite-svg-loader`）
- **存放路径**：`src/assets/svg/`
- **使用方式**：带上 `?component` 后缀作为 Vue 组件导入：
  ```vue
  <script setup lang="ts">
  import MyLogo from "@/assets/svg/logo.svg?component";
  </script>

  <template>
    <MyLogo class="w-8 h-8 text-primary" />
    <!-- 或使用 AtIcon -->
    <AtIcon :icon="MyLogo" />
  </template>
  ```

### 4. Element Plus 官方图标
- **依赖库**：`@element-plus/icons-vue`
- **使用方式**：直接导入图标组件对象并传入 `:icon`。

### 5. iconfont 阿里巴巴矢量库
- **格式**：以 `IF-` 开头（例如 `IF-pure-iconfont-wechat`）。
- **静态资源**：位于 `src/assets/iconfont/`（包含 `iconfont.js` 与 `iconfont.css`）。

---

## 💡 最佳实践与避坑指南

1. **写页面排版**：优先使用 `<AtIcon icon="ep:xxx" />`，配合 Tailwind CSS 控制布局与悬停特效，编码最迅速。
2. **写 Element Plus 属性**：使用 `useRenderIcon('ep:xxx')` 绑定到 `:icon` 属性。
3. **动态后台路由菜单**：在路由 meta 中声明 `icon: "ep:user"` 或 `icon: "ep/home-filled"`，框架侧边栏会自动完成解析渲染。
