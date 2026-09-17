# Anta Admin - Generic Admin Scaffold

Anta Admin is an out-of-the-box generic enterprise admin scaffold template. Built completely on `ECMAScript` modules (`ESM`) with the latest `Vue 3`, `Vite`, `Element-Plus`, `TypeScript`, `Pinia`, and `Tailwindcss`.

This project is completely decoupled from external proprietary utility libraries (removed `@pureadmin/descriptions` and `@pureadmin/utils`), with all utilities and descriptions component implemented locally in `src/utils` and `src/components/ReDescriptions`.

---

## 🌟 Highlights

- **Modern Tech Stack**: Vue 3.5+, Vite 8+, Element-Plus, TypeScript, Pinia, Tailwindcss
- **Zero Proprietary Vendor Lock-in**: `@pureadmin/utils` and `@pureadmin/descriptions` are completely replaced by clean local implementations in `src/utils` and `src/components/ReDescriptions`
- **Enterprise Features**: Dynamic routing, multi-tab caching, permission controls, i18n, light/dark modes, full-screen/watermark, global state management
- **Comprehensive Local Utilities**: 50+ local utilities including type checks, deep clone, DOM manipulation, color tools, storage, debounce/throttle, and ECharts composables
- **Ultra-fast Build**: Vite native ESM HMR, on-demand component and icon imports, gzip/brotli compression

---

## 🛠️ Local Utilities Usage

All utilities are available from `@/utils`:

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

### Descriptions Component

```vue
<template>
  <PureDescriptions border :columns="columns" :data="data" :column="3" />
</template>
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server
pnpm dev

# 3. Build for production
pnpm build
```

---

## 📄 License

[MIT License](https://opensource.org/licenses/MIT)
