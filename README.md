# Anta Admin 通用后台管理脚手架

Anta Admin 是一款开箱即用的通用企业级中后台管理系统脚手架模版。完全采用 `ECMAScript` 模块（`ESM`）规范编写和组织代码，基于最新的 **`Vue 3`、`Vite`、`Element-Plus`、`TypeScript`、`Pinia`、`Tailwindcss v4`** 构建。

本项目已**完全解耦外部特定工具库依赖（彻底去除了 `@pureadmin/descriptions` 与 `@pureadmin/utils`）**，内置完备的**本地通用工具函数库与高阶组件**，结构清晰、依赖极简、零厂商锁定，可直接作为各类中后台系统的项目脚手架与基础底座。

---

## 🌟 特性亮点

- **最新现代技术栈**：Vue 3.5+、Vite 8+、Element-Plus、TypeScript 6+、Pinia、Tailwindcss v4
- **零外部私有工具库锁定**：彻底去除 `@pureadmin/utils` 与 `@pureadmin/descriptions`，全部工具函数与描述列表组件本地化至 `src/utils` 和 `src/components/ReDescriptions`，可自由根据企业规范扩展
- **极简彻底净化**：全面清理历史组件库侵入式的 `withInstall` 包装层，所有组件入口均为原生 Vue 组件纯净直接导出
- **全能混合图标体系**：内置全局免 import 图标组件 `<AtIcon />`，融合 Iconify 20万+在线图标、编译期离线提取、本地 SVG、Element Plus 图标与阿里 iconfont
- **Tailwind CSS v4 深度整合**：原生集成 `@tailwindcss/vite`，CSS-first 零配置文件，原子类变量与 Element Plus 主题色及暗黑模式无缝联动
- **开箱即用通用脚手架**：动态路由、多标签页缓存、权限指令控制、国际化多语言、暗黑/明亮主题切换、全屏/水印、全局状态管理等
- **工业级本地工具库**：涵盖类型安全判断、深浅拷贝、DOM 与剪贴板、颜色计算、防抖节流、文件下载、ECharts 响应式等 50+ 常用方法与 Hooks
- **极致轻量打包**：基于 Vite 原生 ESM 极速热更新，严格 Tree-shaking，首屏打包图标相关体积不足 **8 KB**

---

## 📁 目录结构

```text
├── build/                 # Vite 构建与插件配置
├── locales/               # 国际化语言包 (zh-CN, en)
├── mock/                  # 本地 Mock 数据服务
├── public/                # 静态资源与全局平台运行时配置 (platform-config.json)
├── src/
│   ├── api/               # 业务接口定义
│   ├── assets/            # 静态资源（SVG、图标、图片等）
│   ├── components/        # 全局通用组件
│   │   ├── ReDescriptions/# 本地描述列表组件 (替代 @pureadmin/descriptions)
│   │   ├── ReIcon/        # 全能图标系统 (包含全局组件 AtIcon 与 useRenderIcon)
│   │   └── ...            # 其它高阶组件
│   ├── config/            # 运行时配置读取
│   ├── directives/        # 自定义指令 (copy, ripple, auth 等)
│   ├── layout/            # 核心布局（侧边栏、顶部导航、标签栏、配置抽屉等）
│   ├── plugins/           # 插件初始化 (element-plus, i18n, echarts 等)
│   ├── router/            # 路由配置与动态鉴权
│   ├── store/             # Pinia 状态管理
│   ├── style/             # 全局样式与 Tailwind 配置
│   ├── utils/             # 本地通用工具函数库 (替代 @pureadmin/utils)
│   │   ├── is.ts          # 类型与数据判断
│   │   ├── clone.ts       # 深浅拷贝 (基于 lodash-es)
│   │   ├── dom.ts         # DOM、剪贴板、ResizeObserver、水印
│   │   ├── color.ts       # 颜色加深/变浅/渐变/随机色
│   │   ├── storage.ts     # 本地与会话存储 (storageLocal, storageSession)
│   │   ├── tools.ts       # 防抖、节流、延时、设备检测、字节格式化等
│   │   ├── download.ts    # 文件下载
│   │   ├── hooks.ts       # useGlobal, useDark, useECharts, useLoader
│   │   └── index.ts       # 统一导出入口
│   ├── views/             # 页面视图
│   ├── App.vue            # 根组件
│   └── main.ts            # 项目入口
├── types/                 # 全局 TypeScript 类型声明
├── package.json           # 项目依赖与脚本
├── tsconfig.json          # TypeScript 编译配置
└── vite.config.ts         # Vite 配置文件
```

---

## 🎨 Tailwind CSS v4 样式指南

项目采用最新的 **Tailwind CSS v4**（CSS-first 零配置文件）：

### 1. 与 Element Plus 主题变量无缝联动
在 `src/style/tailwind.css` 中，Tailwind 变量与 Element Plus 主题深度融合。当切换系统主题色或暗黑模式时，样式自动实时响应：
```vue
<!-- 背景色随主题切换，文字颜色与 Element Plus 主题色联动 -->
<div class="bg-bg_color text-primary p-4 rounded-lg shadow">
  <span class="text-text_color_primary font-bold">标题内容</span>
  <p class="text-text_color_regular">正文说明</p>
</div>
```

### 2. 内置高频原子布局工具类 (`@utility`)
- `flex-c`：水平垂直居中（等同于 `flex justify-center items-center`）
- `flex-ac`：等距水平垂直居中（等同于 `flex justify-around items-center`）
- `flex-bc`：两端对齐水平垂直居中（等同于 `flex justify-between items-center`）
- `navbar-bg-hover`：顶部导航栏暗黑与悬浮自适应

---

## 🌟 全局图标系统 (`AtIcon` & `useRenderIcon`)

项目中提供了媲美 UnoCSS 的极简图标体验，同时完整保留了对 Element Plus 组件属性的无缝适配：

### 1. 页面模板中使用 `<AtIcon />`（全局组件，免 import）
```vue
<template>
  <div class="flex items-center gap-4">
    <!-- Iconify 在线图标（20万+ 图标免下载，格式 "集合:名称"） -->
    <AtIcon icon="ep:edit" class="text-xl text-primary hover:scale-125 transition-transform" />
    <AtIcon icon="ri:search-line" size="20" color="#409eff" />
    <AtIcon icon="mdi:github" class="size-6 text-gray-700 dark:text-white" />

    <!-- 离线本地注册图标（格式 "集合/名称"，离线内网环境首选） -->
    <AtIcon icon="ep/menu" size="18" />

    <!-- 本地 SVG、Vue 图标组件、图片 URL -->
    <AtIcon :icon="Delete" />
  </div>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
</script>
```

### 2. Element Plus 按钮与输入框中使用 `useRenderIcon`
```vue
<template>
  <!-- 直接绑定到 Element Plus 组件的原生 icon 属性 -->
  <el-button type="primary" :icon="useRenderIcon('ep:search')">搜索</el-button>
  <el-input :prefix-icon="useRenderIcon('ri:lock-line')" placeholder="请输入密码" />
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
</script>
```
> 📖 更多详细配置请查阅 [ReIcon 使用文档](file:///Users/another/Documents/OpenSource/vue-pure-admin/src/components/ReIcon/README.md)。

---

## 📋 本地描述列表组件 (`PureDescriptions`)

本地实现的 `<PureDescriptions />`（或 `<AntaDescriptions />`）基于 Element Plus `el-descriptions` 进行深度高阶封装，支持配置化声明、自定义渲染器与复制：

```vue
<template>
  <PureDescriptions border :columns="columns" :data="data" :column="3" />
</template>

<script setup lang="ts">
import type { DescriptionsColumns } from "@/components/ReDescriptions";

const columns: DescriptionsColumns[] = [
  { label: "用户名", prop: "username" },
  { label: "角色", prop: "role" },
  { label: "电话", prop: "phone", copy: true },
  {
    label: "状态",
    prop: "status",
    cellRenderer: ({ value }) => (
      <el-tag type={value === 1 ? "success" : "info"}>
        {value === 1 ? "启用" : "停用"}
      </el-tag>
    )
  }
];
const data = [{ username: "admin", role: "管理员", phone: "13800138000", status: 1 }];
</script>
```
> 📖 更多详细配置请查阅 [ReDescriptions 使用文档](file:///Users/another/Documents/OpenSource/vue-pure-admin/src/components/ReDescriptions/README.md)。

---

## 🛠️ 本地工具库使用指南 (`@/utils`)

所有通用工具函数均可直接从 `@/utils` 统一导入使用：

```ts
import {
  cloneDeep,
  isAllEmpty,
  debounce,
  throttle,
  formatBytes,
  useDark,
  useGlobal,
  useECharts,
  useWatermark,
  downloadByUrl
} from "@/utils";
```
> 📖 50+ 工具函数详细使用示例请查阅 [本地工具库详细 API 指南](file:///Users/another/Documents/OpenSource/vue-pure-admin/src/utils/README.md)。

---

## 🚀 快速开始

### 运行环境推荐
- **Node.js**: `>= 20.x` (推荐最新 LTS)
- **PNPM**: `>= 9.x`

### 安装与启动

```bash
# 1. 克隆或下载项目后进入根目录
cd anta-admin

# 2. 安装项目依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 构建生产产物
pnpm build

# 5. 代码类型检查
pnpm typecheck
```

---

## ⚙️ 平台全局配置

运行时配置位于 `public/platform-config.json`，修改后无需重新编译打包即可即时生效：
- `Title`: 系统名称展示（默认为 `Anta Admin`）
- `Theme`: 初始主题色与配色方案
- `Layout`: 默认菜单布局模式（`vertical` 垂直、`horizontal` 水平、`mix` 混合）
- `KeepAlive`: 是否开启页面标签缓存

---

## 📄 开源许可

[MIT License](https://opensource.org/licenses/MIT)
