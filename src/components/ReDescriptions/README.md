# Anta Descriptions 描述列表组件

`ReDescriptions` 是 Anta Admin 内置的本地化描述列表组件，完全替代了原有的外部私有库 `@pureadmin/descriptions`。基于 Element Plus `el-descriptions` 进行深度高阶封装，支持**配置化列声明、数据源自动映射、JSX/TSX 自定义渲染器、复制功能、加载中遮罩**等企业级特性。

已在全局自动注册为 `<PureDescriptions />` 和 `<AntaDescriptions />`，零 import 直接在任意模板中使用。

---

## 🚀 快速上手

### 基础用法（数据驱动配置）
```vue
<template>
  <PureDescriptions
    title="用户信息展示"
    border
    :column="3"
    :columns="columns"
    :data="userData"
  />
</template>

<script setup lang="tsx">
import { ref } from "vue";
import type { DescriptionsColumns } from "@/components/ReDescriptions";

const userData = ref([
  {
    username: "admin",
    role: "超级管理员",
    phone: "13800138000",
    status: 1,
    createTime: "2026-09-18 10:00:00"
  }
]);

const columns: DescriptionsColumns[] = [
  { label: "用户名", prop: "username" },
  { label: "所属角色", prop: "role" },
  {
    label: "联系电话",
    prop: "phone",
    copy: true // 点击支持一键快速复制
  },
  {
    label: "账号状态",
    prop: "status",
    cellRenderer: ({ value }) => (
      <el-tag type={value === 1 ? "success" : "danger"}>
        {value === 1 ? "正常启用" : "停用锁定"}
      </el-tag>
    )
  },
  { label: "注册时间", prop: "createTime", span: 2 }
];
</script>
```

---

## 🛠️ API 配置说明

### 1. 组件 Props

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `columns` | `DescriptionsColumns[]` | `[]` | **核心属性**，描述项列配置列表 |
| `data` | `Record<string, any>[]` | `[]` | 数据源数组（通常取首条记录自动回显） |
| `border` | `boolean` | `false` | 是否展示边框 |
| `column` | `number` | `3` | 一行包含的列数 |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | 排列方向 |
| `size` | `"large" \| "default" \| "small"` | `"default"` | 列表尺寸 |
| `title` | `string` | `-` | 描述列表标题 |
| `extra` | `string` | `-` | 右上角操作区内容 |
| `loading` | `Loading` | `-` | 加载动画遮罩配置 |
| `align` | `"left" \| "center" \| "right"` | `"left"` | 默认内容对齐方式 |
| `labelAlign` | `"left" \| "center" \| "right"` | `"left"` | 默认标签对齐方式 |

### 2. `DescriptionsColumns` 列配置项

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `prop` | `string` | 对应数据源中的字段名 |
| `label` | `string` | 字段标题标签文案 |
| `span` | `number` | 该项占用的列跨度（默认 1） |
| `width` | `string \| number` | 列宽度 |
| `minWidth` | `string \| number` | 最小宽度 |
| `align` | `"left" \| "center" \| "right"` | 本项内容对齐方式 |
| `labelAlign` | `"left" \| "center" \| "right"` | 本项标签对齐方式 |
| `copy` | `boolean` | 是否开启一键快速复制到剪贴板 |
| `hide` | `boolean \| ((attrs?: any) => boolean)` | 是否动态隐藏该项 |
| `cellRenderer` | `(params) => VNode \| any` | 自定义内容渲染函数（支持 JSX/TSX） |
| `labelRenderer`| `(params) => VNode \| any` | 自定义标签渲染函数（支持 JSX/TSX） |
| `slot` | `string` | 具名插槽名称（通过插槽自定义渲染内容） |

---

## 💡 高阶技巧：通过插槽渲染

除了 `cellRenderer`，也可以在模板中通过声明 `slot` 结合 `<template #插槽名>` 渲染复杂交互：
```vue
<template>
  <PureDescriptions :columns="columns" :data="data">
    <template #customOperation="{ value }">
      <el-button type="primary" size="small" @click="handleEdit(value)">
        编辑详情
      </el-button>
    </template>
  </PureDescriptions>
</template>
```
