# Anta Table (PureTable) 表格高阶组件

`RePureTable` 是 Anta Admin 内置的本地化高阶表格组件，**完全替代了原有的外部依赖库 `@pureadmin/table`**。基于 Element Plus `el-table` 进行深度二次封装，实现数据配置驱动列、JSX/TSX 自定义单元格/表头渲染、分页联动、自适应高度以及国际化支持。

已在全局注册为 `<PureTable />` 与 `<pure-table />`，零 import 直接在任意模板中使用。

---

## 🚀 核心特性

- **零外部锁定**：完全本地实现，无 `@pureadmin/*` 外部 npm 依赖，完全基于 `@/utils`、`lodash-es` 与 Element Plus。
- **配置化列声明**：通过 `columns: TableColumnList` 统一声明表格列、对齐方式、表头提示、溢出折叠与层级结构。
- **自定义渲染支持**：支持 `cellRenderer` 与 `headerRenderer` 函数式 JSX 编写，同时无缝兼容 Vue 插槽（`default`、`header`、`filter-icon`、`expand`）。
- **内置分页集成**：传入 `pagination` 属性即可自动联动下方 `el-pagination`，响应式更新。
- **动态自适应高度**：设置 `adaptive` 开启窗口缩放自适应计算表格容器高度，并支持表头 `sticky` 布局吸顶。
- **对抗式安全加固**：原生防御 XSS 注入风险，严格过滤 Loading SVG 中的危险脚本与事件。

---

## 💻 快速上手

### 基础用法

```vue
<template>
  <pure-table
    row-key="id"
    border
    :data="dataList"
    :columns="columns"
    :pagination="pagination"
    @page-size-change="onSizeChange"
    @page-current-change="onCurrentChange"
  />
</template>

<script setup lang="tsx">
import { ref, reactive } from "vue";
import type { PaginationProps } from "@/components/RePureTable";

const dataList = ref([
  { id: 1, name: "用户A", status: 1 },
  { id: 2, name: "用户B", status: 0 }
]);

const pagination = reactive<PaginationProps>({
  total: 2,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const columns: TableColumnList = [
  { label: "ID", prop: "id", width: 80 },
  { label: "用户名", prop: "name" },
  {
    label: "状态",
    prop: "status",
    cellRenderer: ({ row }) => (
      <el-tag type={row.status === 1 ? "success" : "danger"}>
        {row.status === 1 ? "启用" : "禁用"}
      </el-tag>
    )
  }
];

const onSizeChange = (val: number) => {
  pagination.pageSize = val;
};

const onCurrentChange = (val: number) => {
  pagination.currentPage = val;
};
</script>
```

---

## 📚 导出与类型

所有相关类型均可通过 `@/components/RePureTable` 导入：

```ts
import {
  PureTable,
  type TableColumns,
  type TableColumnList,
  type PaginationProps,
  type LoadingConfig,
  type AdaptiveConfig
} from "@/components/RePureTable";
```
