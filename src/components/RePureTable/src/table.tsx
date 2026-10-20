import {
  ref,
  unref,
  toRefs,
  inject,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  defineComponent,
  getCurrentInstance,
  type CSSProperties
} from "vue";
import props from "./props";
import Renderer from "./renderer";
import { en, zhCn, zhTw } from "../locale";
import type {
  Language,
  PureTableProps,
  PaginationProps,
  TableColumnScope,
  PureTableInstallOptions
} from "../types";
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElConfigProvider,
  ElLoadingDirective
} from "element-plus";
import { kebabCase } from "lodash-es";
import { isFunction, isBoolean, isString, useDark, debounce } from "@/utils";

/**
 * 针对原生 SVG 字符串做对抗式安全过滤，阻断 XSS 风险
 */
const sanitizeSvg = (rawSvg?: string): string | undefined => {
  if (!rawSvg || typeof rawSvg !== "string") return undefined;
  return rawSvg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/href\s*=\s*(['"])\s*javascript:.*?\1/gi, "");
};

export default defineComponent({
  name: "PureTable",
  props,
  directives: {
    Loading: ElLoadingDirective
  },
  emits: ["page-size-change", "page-current-change"],
  setup(props, { slots, attrs, emit, expose }) {
    const {
      locale: defaultLocale,
      i18n,
      ssr
    } = inject<PureTableInstallOptions>("locale", {
      locale: null,
      i18n: null,
      ssr: false
    });

    const {
      locale,
      columns,
      loading,
      tableKey,
      adaptive,
      pagination,
      alignWhole,
      headerAlign,
      loadingConfig,
      adaptiveConfig,
      rowHoverBgColor,
      showOverflowTooltip
    } = toRefs(props) as unknown as PureTableProps;

    const isClient = ref(false);
    const { isDark } = useDark();
    const instance = getCurrentInstance();

    const showPagination = computed(() => {
      const p = unref(pagination) as PaginationProps | undefined;
      return Boolean(
        p &&
        (p.currentPage !== undefined ||
          p.pageSize !== undefined ||
          p.total !== undefined)
      );
    });

    const globalI18n = computed(() => {
      if (!unref(i18n)) return null;
      const targetI18n = unref(i18n);
      const elLocale =
        // vue-i18n
        targetI18n?.global?.getLocaleMessage?.(
          unref(targetI18n?.global?.locale)
        )?.["el"] ||
        // @ts-expect-error @nuxtjs/i18n
        targetI18n?.getLocaleMessage?.(unref(targetI18n?.locale))?.["el"];
      if (elLocale) {
        return { el: elLocale } as Language;
      } else {
        console.warn("PureTable: Element Plus 国际化文件未配置到 vue-i18n 中");
        return null;
      }
    });

    const matchLocale = (loc: unknown): Language | undefined => {
      if (!loc) return undefined;
      if (isString(loc)) {
        const key = kebabCase(loc as string);
        return [en, zhCn, zhTw].find(i18 => i18.name === key);
      }
      return loc as Language;
    };

    const globalLocale = computed(() => matchLocale(defaultLocale));
    const locales = computed(() => matchLocale(unref(locale)));

    const convertLoadingConfig = computed(() => {
      const cfg = unref(loadingConfig);
      if (!cfg) return {};
      const { text, spinner, svg, viewBox } = cfg;
      return {
        "element-loading-text": text,
        "element-loading-spinner": spinner,
        "element-loading-svg": sanitizeSvg(svg),
        "element-loading-svg-view-box": viewBox
      };
    });

    const loadingBackground = computed(() => {
      if (!unref(loading)) return {};
      const customBg = unref(loadingConfig)?.background;
      return {
        "element-loading-background": customBg
          ? customBg
          : isDark.value
            ? "rgba(0, 0, 0, 0.45)"
            : "rgba(255, 255, 255, 0.45)"
      };
    });

    const getPaginationStyle = computed((): CSSProperties => {
      const paginationVal = (unref(pagination) || {}) as PaginationProps;
      const align = paginationVal.align;
      const justify =
        align === "left"
          ? "flex-start"
          : align === "center"
            ? "center"
            : "flex-end";
      const baseStyle: CSSProperties = {
        width: "100%",
        margin: "16px 0",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: justify
      };

      if (!paginationVal.style) return baseStyle;
      if (typeof paginationVal.style === "object") {
        return { ...baseStyle, ...(paginationVal.style as object) };
      }
      return baseStyle;
    });

    const handleSizeChange = (val: number) => {
      const p = unref(pagination);
      if (p) p.pageSize = val;
      emit("page-size-change", val);
    };

    const handleCurrentChange = (val: number) => {
      const p = unref(pagination);
      if (p) p.currentPage = val;
      emit("page-current-change", val);
    };

    const renderColumns = (col: Record<string, any>, index: number) => {
      const {
        cellRenderer,
        slot,
        headerRenderer,
        headerSlot,
        filterIconSlot,
        expandSlot,
        hide,
        children,
        prop,
        ...args
      } = col;

      if (isFunction(hide) && hide(attrs)) {
        return null;
      }
      if (isBoolean(hide) && hide) {
        return null;
      }

      const defaultSlots = {
        default: (scope: TableColumnScope) => {
          if (cellRenderer) {
            return (
              <Renderer
                render={cellRenderer}
                params={Object.assign(scope, {
                  index: scope.$index,
                  props,
                  attrs
                })}
              />
            );
          } else if (slot && slots?.[slot]) {
            return slots[slot]?.(
              Object.assign(scope, {
                index: scope.$index,
                props,
                attrs
              })
            );
          }
          return null;
        }
      };

      const scopedSlots: Record<string, (scope: TableColumnScope) => any> = {
        ...defaultSlots
      };

      if (headerRenderer) {
        scopedSlots.header = (scope: TableColumnScope) => (
          <Renderer
            render={headerRenderer}
            params={Object.assign(scope, {
              index: scope.$index,
              props,
              attrs
            })}
          />
        );
      } else if (headerSlot && slots?.[headerSlot]) {
        scopedSlots.header = (scope: TableColumnScope) =>
          slots[headerSlot]?.(
            Object.assign(scope, {
              index: scope.$index,
              props,
              attrs
            })
          );
      }

      if (filterIconSlot && slots?.[filterIconSlot]) {
        scopedSlots["filter-icon"] = (scope: TableColumnScope) =>
          slots[filterIconSlot]?.(
            Object.assign(scope, {
              index: scope.$index,
              props,
              attrs
            })
          );
      }

      if (expandSlot && slots?.[expandSlot]) {
        scopedSlots.expand = (scope: TableColumnScope) =>
          slots[expandSlot]?.(
            Object.assign(scope, {
              index: scope.$index,
              props,
              attrs
            })
          );
      }

      if (children && children.length > 0) {
        scopedSlots.default = () => children.map(renderColumns);
      }

      return (
        <ElTableColumn
          key={index}
          {...args}
          prop={isFunction(prop) && prop(index) ? prop(index) : prop}
          align={col?.align || unref(alignWhole)}
          headerAlign={col?.headerAlign || unref(headerAlign)}
          showOverflowTooltip={
            col?.showOverflowTooltip ?? unref(showOverflowTooltip)
          }
        >
          {scopedSlots}
        </ElTableColumn>
      );
    };

    const getTableRef = () =>
      instance?.proxy?.$refs[`TableRef${unref(tableKey)}`];

    const getTableDoms = () => (getTableRef() as any)?.$refs ?? {};

    const setAdaptive = async () => {
      await nextTick();
      const tableWrapper = getTableDoms().tableWrapper;
      if (!tableWrapper) return;
      const offsetBottom = unref(adaptiveConfig)?.offsetBottom ?? 96;
      const rect = tableWrapper.getBoundingClientRect();
      tableWrapper.style.height = `${window.innerHeight - rect.top - offsetBottom}px`;
    };

    const debounceSetAdaptive = debounce(
      setAdaptive,
      unref(adaptiveConfig)?.timeout ?? 60
    );

    const setHeaderSticky = async (zIndex = 3) => {
      await nextTick();
      const tableHeaderRef = getTableDoms().tableHeaderRef;
      if (!tableHeaderRef?.$el) return;
      const headerStyle = tableHeaderRef.$el.style;
      headerStyle.position = "sticky";
      headerStyle.top = "0px";
      headerStyle.zIndex = String(zIndex);
    };

    onMounted(() => {
      isClient.value = true;
      nextTick(() => {
        if (unref(rowHoverBgColor)) {
          const tableWrapper = getTableDoms().tableWrapper;
          if (tableWrapper?.style) {
            tableWrapper.style.setProperty(
              "--el-table-row-hover-bg-color",
              unref(rowHoverBgColor),
              "important"
            );
          }
        }

        if (unref(adaptive)) {
          setAdaptive();
          window.addEventListener("resize", debounceSetAdaptive);
          const hasFixHeader = Reflect.has(
            unref(adaptiveConfig) || {},
            "fixHeader"
          );
          if (!hasFixHeader || unref(adaptiveConfig)?.fixHeader) {
            setHeaderSticky(unref(adaptiveConfig)?.zIndex ?? 3);
          }
        }
      });
    });

    onBeforeUnmount(() => {
      if (unref(adaptive)) {
        window.removeEventListener("resize", debounceSetAdaptive);
      }
    });

    expose({
      /** 获取表格实例 */
      getTableRef,
      /** 获取表格内部 DOM 元素集合 */
      getTableDoms,
      /** 设置表格自适应高度 */
      setAdaptive,
      /** 设置表头为 sticky 布局 */
      setHeaderSticky
    });

    const renderTable = () => {
      return (
        <>
          <ElTable {...props} {...attrs} ref={`TableRef${unref(tableKey)}`}>
            {{
              default: () => (unref(columns) || []).map(renderColumns),
              append: () => slots.append && slots.append(),
              empty: () => slots.empty && slots.empty()
            }}
          </ElTable>
          {showPagination.value ? (
            <ElPagination
              {...attrs}
              class="pure-pagination"
              style={getPaginationStyle.value}
              {...((unref(pagination) || {}) as any)}
              layout={
                (unref(pagination) as PaginationProps)?.layout ??
                "total, sizes, prev, pager, next, jumper"
              }
              pageSizes={
                (unref(pagination) as PaginationProps)?.pageSizes ?? [
                  5, 10, 15, 20
                ]
              }
              onSize-change={handleSizeChange}
              onCurrent-change={handleCurrentChange}
            />
          ) : null}
        </>
      );
    };

    const renderPureTable = () => {
      const activeLocale =
        unref(locales) || unref(globalI18n) || unref(globalLocale);

      return (
        <div
          class="pure-table"
          style={{ width: "100%" }}
          v-loading={unref(loading)}
          {...unref(loadingBackground)}
          {...unref(convertLoadingConfig)}
        >
          {activeLocale ? (
            <ElConfigProvider locale={activeLocale}>
              {renderTable()}
            </ElConfigProvider>
          ) : (
            renderTable()
          )}
        </div>
      );
    };

    return () =>
      ssr ? isClient.value && renderPureTable() : renderPureTable();
  }
});
