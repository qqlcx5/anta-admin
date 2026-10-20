# Anta Admin · AI 研发规范

## 一、品牌规范（Anta）

- **品牌定义**：品牌名 `Anta`，产品名 `Anta Admin`
- **前缀规范**：组件统一 `At` 前缀（如 `AtIcon`）；locales key、CSS 变量、Storage key 统一 `anta` 小写前缀（如 `antaLogin`、`anta-*`）。
- **零历史残留**：代码、注释、文案、文档链接中禁止出现 `PureAdmin`、`PureDescriptions`、`vue-pure-admin`、`@pureadmin/*` 等历史品牌；发现即清除，不保留任何旧别名。

## 二、核心原则

1. **最高纲领**：宁可推倒重写，不可修修补补；宁可破坏旧用法，不可制造“双轨制”或并存两套心智模型。
2. **不为历史兜底，但必须先告知**：不写兼容垫片、不留旧别名、不支持双重数据格式，每次行动前必须明确告知。
3. **单一心智模型**：同一功能仅允许存在一种标准实现（如统一采用 `AtIcon` 与 `useRenderIcon`）。
