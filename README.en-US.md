# Anta Admin - Generic Admin Scaffold

Anta Admin is an out-of-the-box generic enterprise admin scaffold template. Built completely on `ECMAScript` modules (`ESM`) with the latest **`Vue 3`、`Vite`、`Element-Plus`、`TypeScript`、`Pinia`、`Tailwindcss v4`**.

This project is **completely decoupled from external proprietary utility libraries (removed `@pureadmin/descriptions` and `@pureadmin/utils`)**, with all utilities and high-order components implemented locally in `src/utils` and `src/components/ReDescriptions`. Clean structure, zero vendor lock-in, ready to serve as a solid enterprise foundation.

---

## 🌟 Highlights

- **Modern Tech Stack**: Vue 3.5+, Vite 8+, Element-Plus, TypeScript 6+, Pinia, Tailwindcss v4
- **Zero Proprietary Vendor Lock-in**: `@pureadmin/utils` and `@pureadmin/descriptions` are completely replaced by clean local implementations in `src/utils` and `src/components/ReDescriptions`
- **Clean Component Exports**: Completely removed legacy invasive `withInstall` boilerplate; all component entries export pure Vue components directly
- **Hybrid Icon System**: Built-in global component `<AtIcon />` seamlessly combining Iconify (200k+ online icons), build-time offline extraction, local SVG components, Element Plus icons, and Alibaba iconfont
- **Tailwind CSS v4 Integration**: Native `@tailwindcss/vite` integration, CSS-first zero-config, with utility classes automatically linked to Element Plus theme colors and dark mode
- **Enterprise Ready**: Dynamic routing, multi-tab caching, permission directives, i18n, light/dark themes, full-screen/watermark, global state management
- **Comprehensive Local Utilities**: 50+ local utilities including type checks, deep clone (lodash-es), DOM/clipboard tools, color calculations, debounce/throttle, and reactive ECharts composables
- **Ultra-lightweight Bundle**: Vite native ESM HMR, strict tree-shaking, initial icon bundle size under **8 KB**

---

## 📁 Directory Structure

```text
├── build/                 # Vite build and plugin configurations
├── locales/               # Internationalization language packs (zh-CN, en)
├── mock/                  # Local mock server
├── public/                # Static assets & runtime platform configuration (platform-config.json)
├── src/
│   ├── api/               # API service definitions
│   ├── assets/            # Static assets (SVG, images, icons)
│   ├── components/        # Global common components
│   │   ├── ReDescriptions/# Local descriptions list component (replaces @pureadmin/descriptions)
│   │   ├── ReIcon/        # Hybrid icon system (includes AtIcon & useRenderIcon)
│   │   └── ...            # Other high-order components
│   ├── config/            # Runtime config loader
│   ├── directives/        # Custom directives (copy, ripple, auth, etc.)
│   ├── layout/            # Core layout (sidebar, navbar, tags, settings drawer)
│   ├── plugins/           # Plugin initializations (element-plus, i18n, echarts, etc.)
│   ├── router/            # Router setup and dynamic permission guards
│   ├── store/             # Pinia stores
│   ├── style/             # Global styles and Tailwind CSS configuration
│   ├── utils/             # Local utilities library (replaces @pureadmin/utils)
│   │   ├── is.ts          # Type and boundary checks
│   │   ├── clone.ts       # Shallow & deep clone (via lodash-es)
│   │   ├── dom.ts         # DOM, clipboard, ResizeObserver, watermark
│   │   ├── color.ts       # Color darken/lighten/gradient/random
│   │   ├── storage.ts     # Local and session storage wrappers
│   │   ├── tools.ts       # Debounce, throttle, delay, device detection, formatBytes
│   │   ├── download.ts    # File download helpers
│   │   ├── hooks.ts       # useGlobal, useDark, useECharts, useLoader
│   │   └── index.ts       # Unified export entry
│   ├── views/             # Page views
│   ├── App.vue            # Root component
│   └── main.ts            # Application entry point
├── types/                 # Global TypeScript definitions
├── package.json           # Dependencies and npm scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

---

## 🎨 Tailwind CSS v4 Guide

Anta Admin utilizes **Tailwind CSS v4** with a CSS-first, zero-config architecture:

### 1. Element Plus Theme Variables Linkage
In `src/style/tailwind.css`, Tailwind color variables are directly linked to Element Plus CSS variables:
```vue
<!-- Background and text colors respond to theme changes automatically -->
<div class="bg-bg_color text-primary p-4 rounded-lg shadow">
  <span class="text-text_color_primary font-bold">Title</span>
  <p class="text-text_color_regular">Description text</p>
</div>
```

### 2. High-frequency Layout Utilities (`@utility`)
- `flex-c`: Horizontally and vertically centered (`flex justify-center items-center`)
- `flex-ac`: Evenly spaced centered (`flex justify-around items-center`)
- `flex-bc`: Space-between centered (`flex justify-between items-center`)
- `navbar-bg-hover`: Adaptive navbar hover and dark-mode styles

---

## 🌟 Global Icon System (`AtIcon` & `useRenderIcon`)

Anta Admin provides a UnoCSS-like minimalist icon experience while maintaining full compatibility with Element Plus properties and dynamic backend menus:

### 1. In Page Templates (`<AtIcon />` - No import needed)
```vue
<template>
  <div class="flex items-center gap-4">
    <!-- Iconify online icons (200k+ icons, format: "collection:name") -->
    <AtIcon icon="ep:edit" class="text-xl text-primary hover:scale-125 transition-transform" />
    <AtIcon icon="ri:search-line" size="20" color="#409eff" />
    <AtIcon icon="mdi:github" class="size-6 text-gray-700 dark:text-white" />

    <!-- Offline pre-bundled menu icons (format: "collection/name") -->
    <AtIcon icon="ep/menu" size="18" />

    <!-- Local SVG, Vue components, image URLs -->
    <AtIcon :icon="Delete" />
  </div>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
</script>
```

### 2. In Element Plus Components via `useRenderIcon`
```vue
<template>
  <el-button type="primary" :icon="useRenderIcon('ep:search')">Search</el-button>
  <el-input :prefix-icon="useRenderIcon('ri:lock-line')" placeholder="Enter password" />
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
</script>
```
> 📖 See [ReIcon Documentation](file:///Users/another/Documents/OpenSource/vue-pure-admin/src/components/ReIcon/README.md) for full options.

---

## 📋 Local Descriptions Component (`PureDescriptions`)

The built-in `<PureDescriptions />` (or `<AntaDescriptions />`) component provides declarative schema configurations, custom JSX/TSX renderers, and copy-to-clipboard support:

```vue
<template>
  <PureDescriptions border :columns="columns" :data="data" :column="3" />
</template>

<script setup lang="ts">
import type { DescriptionsColumns } from "@/components/ReDescriptions";

const columns: DescriptionsColumns[] = [
  { label: "Username", prop: "username" },
  { label: "Role", prop: "role" },
  { label: "Phone", prop: "phone", copy: true },
  {
    label: "Status",
    prop: "status",
    cellRenderer: ({ value }) => (
      <el-tag type={value === 1 ? "success" : "info"}>
        {value === 1 ? "Active" : "Disabled"}
      </el-tag>
    )
  }
];
const data = [{ username: "admin", role: "Administrator", phone: "13800138000", status: 1 }];
</script>
```
> 📖 See [ReDescriptions Documentation](file:///Users/another/Documents/OpenSource/vue-pure-admin/src/components/ReDescriptions/README.md) for full options.

---

## 🛠️ Local Utilities (`@/utils`)

All utilities can be imported directly from `@/utils`:

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
> 📖 See [Local Utilities API Guide](file:///Users/another/Documents/OpenSource/vue-pure-admin/src/utils/README.md) for full API reference.

---

## 🚀 Quick Start

### Recommended Environment
- **Node.js**: `>= 20.x` (LTS recommended)
- **PNPM**: `>= 9.x`

### Setup and Running

```bash
# 1. Enter the project directory
cd anta-admin

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev

# 4. Build for production
pnpm build

# 5. Type checking
pnpm typecheck
```

---

## ⚙️ Platform Global Configuration

Runtime configurations are located at `public/platform-config.json`. Changes take effect immediately without rebuilding:
- `Title`: Platform display name (default: `Anta Admin`)
- `Theme`: Initial theme color scheme
- `Layout`: Default menu layout mode (`vertical`, `horizontal`, `mix`)
- `KeepAlive`: Whether page tab caching is enabled

---

## 📄 License

[MIT License](https://opensource.org/licenses/MIT)
