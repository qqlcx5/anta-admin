import type { PropType } from "vue";
import type {
  Language,
  DefaultLanguage,
  TableColumns,
  LoadingConfig,
  PaginationProps,
  AdaptiveConfig,
  Align
} from "../types";
import { ElTable } from "element-plus";

export const tableProps = {
  tableKey: {
    type: [String, Number] as PropType<string | number>,
    default: "0"
  },
  columns: {
    type: Array as PropType<Array<TableColumns>>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingConfig: {
    type: Object as PropType<LoadingConfig>,
    default: () => ({})
  },
  alignWhole: {
    type: String as PropType<Align>,
    default: "left"
  },
  headerAlign: {
    type: String as PropType<Align>,
    default: ""
  },
  showOverflowTooltip: {
    type: [Boolean, Object] as PropType<boolean | Record<string, any>>,
    default: false
  },
  rowHoverBgColor: {
    type: String,
    default: ""
  },
  pagination: {
    type: Object as PropType<PaginationProps>,
    default: () => ({
      total: 0,
      pageSize: 5,
      align: "right",
      size: "default",
      background: false,
      pageSizes: [5, 10, 15, 20],
      layout: "total, sizes, prev, pager, next, jumper"
    })
  },
  adaptive: {
    type: Boolean,
    default: false
  },
  adaptiveConfig: {
    type: Object as PropType<AdaptiveConfig>,
    default: () => ({
      offsetBottom: 96,
      fixHeader: true,
      timeout: 60,
      zIndex: 3
    })
  },
  locale: {
    type: [String, Object] as PropType<DefaultLanguage | Language>,
    default: ""
  },
  ...((ElTable as any).props ?? {})
};

export default tableProps;
