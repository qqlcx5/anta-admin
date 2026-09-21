import {
  DefaultLanguage,
  PaginationProps,
  LoadingConfig,
  TableColumns,
  Language,
  Effect,
  Layout,
  Align,
  Size
} from "./index";
import type {
  TableColumnCtx,
  SummaryMethod,
  ColumnStyle,
  ColumnCls,
  CellStyle,
  TreeNode,
  CellCls,
  Sort
} from "element-plus";
import type { VNode } from "vue";
import type { TableOverflowTooltipOptions } from "element-plus/es/components/table/src/util";

/**
 * @description 撑满内容区自适应高度相关配置
 */
export type AdaptiveConfig = {
  /** 表格距离页面底部的偏移量，默认值为 `96` */
  offsetBottom?: number;
  /** 是否固定表头，默认值为 `true` */
  fixHeader?: boolean;
  /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
  timeout?: number;
  /** 表头的 `z-index`，默认值为 `3` */
  zIndex?: number;
};

/**
 * @description `element-plus` 的 `table` 属性，未拓展
 * @see {@link https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7}
 */
export type TableProps = {
  /** 显示的数据 */
  data: Array<any>;
  /** `Table` 的高度 */
  height?: string | number;
  /** `Table` 的最大高度 */
  maxHeight?: string | number;
  /** 是否为斑马纹 `table`，默认值为 `false` */
  stripe?: boolean;
  /** 是否带有纵向边框，默认值为 `false` */
  border?: boolean;
  /** `Table` 的尺寸 */
  size?: Size;
  /** 列的宽度是否自撑开，默认值为 `true` */
  fit?: boolean;
  /** 是否显示表头，默认值为 `true` */
  showHeader?: boolean;
  /** 是否要高亮当前行，默认值为 `false` */
  highlightCurrentRow?: boolean;
  /** 当前行的 `key` ，只写属性 */
  currentRowKey?: string | number;
  /** 行的 `className` 的回调方法 */
  rowClassName?: ColumnCls<any>;
  /** 行的 `style` 的回调方法 */
  rowStyle?: ColumnStyle<any>;
  /** 单元格的 `className` 的回调方法 */
  cellClassName?: CellCls<any>;
  /** 单元格的 `style` 的回调方法 */
  cellStyle?: CellStyle<any>;
  /** 表头行的 `className` 的回调方法 */
  headerRowClassName?: ColumnCls<any>;
  /** 表头行的 style 的回调方法 */
  headerRowStyle?: ColumnStyle<any>;
  /** 表头单元格的 `className` 的回调方法 */
  headerCellClassName?: CellCls<any>;
  /** 表头单元格的 `style` 的回调方法 */
  headerCellStyle?: CellStyle<any>;
  /** 行数据的 `Key` */
  rowKey?: string | ((row: any) => string);
  /** 空数据时显示的文本内容，默认值为 `No Data` */
  emptyText?: string;
  /** 是否默认展开所有行，默认值为 `false` */
  defaultExpandAll?: boolean;
  /** 可以通过该属性设置 `Table` 目前的展开行 */
  expandRowKeys?: any[];
  /** 默认的排序列的 `prop` 和顺序 */
  defaultSort?: Sort;
  /** `tooltip effect` 属性，默认值为 `dark` */
  tooltipEffect?: Effect;
  /** 溢出 tooltip 的选项 */
  tooltipOptions?: TableOverflowTooltipOptions;
  /** 挂载到哪个 `DOM` 元素 */
  appendFilterPanelTo?: string;
  /** 是否在表尾显示合计行，默认值为 `false` */
  showSummary?: boolean;
  /** 合计行第一列的文本，默认值为 `合计` */
  sumText?: string;
  /** 自定义的合计计算方法 */
  summaryMethod?: SummaryMethod<any>;
  /** 合并行或列的计算方法 */
  spanMethod?: (data: {
    row: any;
    rowIndex: number;
    column: TableColumnCtx<any>;
    columnIndex: number;
  }) =>
    | number[]
    | {
        rowspan: number;
        colspan: number;
      }
    | undefined;
  /** 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为，默认值为 `true` */
  selectOnIndeterminate?: boolean;
  /** 展示树形数据时，树节点的缩进，默认值为 `16` */
  indent?: number;
  /** 是否懒加载子节点数据 */
  lazy?: boolean;
  /** 加载子节点数据的函数，`lazy` 为 `true` 时生效 */
  load?: (row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void;
  /** 渲染嵌套数据的配置选项 */
  treeProps?: {
    hasChildren?: string;
    children?: string;
  };
  /** 设置表格单元、行和列的布局方式，默认值为 `fixed` */
  tableLayout?: Layout;
  /** 总是显示滚动条，默认值为 `false` */
  scrollbarAlwaysOn?: boolean;
  /** 确保主轴的最小尺寸，默认值为 `false` */
  flexible?: boolean;
  /** `body` 的滚动条的包裹容器 `tabindex` */
  scrollbarTabindex?: string | number;
  /** 是否允许拖动最后一列，默认值为 `true` */
  allowDragLastColumn?: boolean;
  /** 自定义 `show-overflow-tooltip` 时的 `tooltip` 内容 */
  tooltipFormatter?: (data: {
    row: any;
    column: any;
    cellValue: any;
  }) => VNode | string;
  /** 在折叠后是否在 `DOM` 中保留展开行内容，默认值为 `false` */
  preserveExpandedContent?: boolean;
};

/**
 * @description 拓展 `element-plus` 的 `table` 属性
 * @see {@link https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7}
 */
export interface PureTableProps extends TableProps {
  /** 唯一键，多个表格实例时使用 */
  tableKey?: string | number;
  /** `Table-column` 配置 `该属性为必填属性` */
  columns: Array<TableColumns>;
  /** 是否开启加载动画，默认值：`false` */
  loading?: boolean;
  /** 加载动画的相关配置 */
  loadingConfig?: LoadingConfig;
  /** 对齐方式，默认值 `left` */
  alignWhole?: Align;
  /** 表头对齐方式，若不设置该项，则使用表格的对齐方式 */
  headerAlign?: Align;
  /** 当内容过长被隐藏时显示 `tooltip`，默认值 `false` */
  showOverflowTooltip?: boolean;
  /** 鼠标经过行时，行的背景色 */
  rowHoverBgColor?: string;
  /** 分页相关配置 */
  pagination?: PaginationProps;
  /** 表格是否撑满内容区自适应高度，默认 `false` */
  adaptive?: boolean;
  /** 撑满内容区自适应高度相关配置 */
  adaptiveConfig?: AdaptiveConfig;
  /** 国际化配置。简体中文：`zhCn`、繁体中文：`zhTw`、英语: `en`，也可以自定义国际化语言 */
  locale?: DefaultLanguage | Language;
}
