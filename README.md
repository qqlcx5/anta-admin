# Anta Admin 通用后台管理脚手架

Anta Admin 是一款开箱即用的通用企业级中后台管理系统脚手架模版。完全采用 `ECMAScript` 模块（`ESM`）规范编写和组织代码，基于最新的 `Vue 3`、`Vite`、`Element-Plus`、`TypeScript`、`Pinia`、`Tailwindcss` 构建。

本项目已完全解耦外部特定工具库依赖（去除了 `@pureadmin/descriptions` 与 `@pureadmin/utils`），内置完备的**本地通用工具函数库与高阶组件**，结构清晰、依赖极简，可直接作为各类中后台系统的项目脚手架与基础底座。

---

## 🌟 特性亮点

- **最新技术栈**：Vue 3.5+、Vite 8+、Element-Plus、TypeScript、Pinia、Tailwindcss
- **零外部私有工具库锁定**：彻底去除 `@pureadmin/utils` 与 `@pureadmin/descriptions`，全部工具函数与描述列表组件本地化至 `src/utils` 和 `src/components/ReDescriptions`，可自由根据企业规范魔改与扩展
- **开箱即用通用脚手架**：动态路由、多标签页缓存、权限控制、国际化多语言、暗黑/明亮主题切换、全屏/水印、全局状态管理等
- **完善的本地工具库**：包含类型校验、深浅拷贝、DOM 与剪贴板、颜色计算、本地存储、防抖节流、文件下载、ECharts 响应式封装等 50+ 实用函数与 Hooks
- **高性能构建与优化**：基于 Vite 原生 ESM 极速热更新，按需引入组件与图标，生产环境支持 gzip/brotli 压缩

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
│   │   ├── clone.ts       # 深浅拷贝
│   │   ├── dom.ts         # DOM、剪贴板、ResizeObserver、水印
│   │   ├── color.ts       # 颜色加深/变浅/渐变/随机色
│   │   ├── storage.ts     # 本地与会话存储 (storageLocal, storageSession)
│   │   ├── tools.ts       # 防抖、节流、延时、设备检测、字节格式化等
│   │   ├── download.ts    # 文件下载
│   │   ├── withInstall.ts # Vue 组件安装器
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

## 🛠️ 本地工具库使用指南

所有工具函数均可直接从 `@/utils` 导入使用：

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
  useWatermark
} from "@/utils";
```

### 描述列表组件使用

本地实现的 `<PureDescriptions />` / `<AntaDescriptions />` 支持声明式配置与插槽渲染：

```vue
<template>
  <PureDescriptions border :columns="columns" :data="data" :column="3" />
</template>

<script setup lang="ts">
const columns = [
  { label: "用户名", prop: "username" },
  { label: "角色", prop: "role" },
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
const data = [{ username: "admin", role: "管理员", status: 1 }];
</script>
```

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
