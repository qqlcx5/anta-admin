import {
  defineComponent,
  createVNode,
  Fragment,
  ref,
  toRefs,
  computed,
  withDirectives,
  mergeProps,
  unref,
  resolveDirective,
  isVNode,
  type PropType
} from "vue";
import { ElDescriptions, ElDescriptionsItem } from "element-plus";
import { copyTextToClipboard } from "@/utils/dom";
import type {
  DescriptionsColumns,
  Loading,
  DescriptionsAlign
} from "../types";

const descriptionsProps = {
  data: {
    type: Array as PropType<Array<Record<string, any>>>,
    default: () => []
  },
  columns: {
    type: Array as PropType<Array<DescriptionsColumns>>,
    default: () => []
  },
  loading: {
    type: Object as PropType<Loading>,
    default: () => ({
      load: false,
      text: "Loading...",
      svg: "",
      spinner: "",
      svgViewBox: "",
      background: ""
    })
  },
  align: {
    type: String as PropType<DescriptionsAlign>,
    default: "left"
  },
  labelAlign: {
    type: String as PropType<DescriptionsAlign>,
    default: ""
  },
  ...(ElDescriptions as any).props
};

const Renderer = defineComponent({
  name: "Renderer",
  props: {
    render: {
      type: Function,
      required: true
    },
    params: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    return () => createVNode(Fragment, null, [props.render(props.params)]);
  }
});

export const PureDescriptions = defineComponent({
  name: "PureDescriptions",
  props: descriptionsProps,
  setup(props: any, { slots, attrs }) {
    const activeCopyIndex = ref(-1);
    const isCopied = ref(false);

    const { data, columns, align, labelAlign, loading } = toRefs(props);

    const titleSlot = slots.title
      ? { title: () => slots.title?.({ props, attrs }) }
      : null;
    const extraSlot = slots.extra
      ? { extra: () => slots.extra?.({ props, attrs }) }
      : null;
    const descSlots = Object.assign({}, titleSlot, extraSlot);

    const handleCopy = (text: any, index: number) => {
      if (isCopied.value) return;
      activeCopyIndex.value = index;
      const success = copyTextToClipboard(String(text));
      if (success) {
        isCopied.value = true;
        setTimeout(() => {
          isCopied.value = false;
        }, 1500);
      }
    };

    return () => {
      const colList = unref(columns) || [];
      const dataList = unref(data) || [];

      const children = colList.map((col: DescriptionsColumns, index: number) => {
        if (typeof col?.hide === "function" && col.hide(attrs)) {
          return null;
        }

        const valList = dataList.map(row => row?.[col?.prop || ""]);
        const val = valList[0];

        const itemDefault = () => {
          if (col?.cellRenderer) {
            return createVNode(Renderer, {
              render: col.cellRenderer,
              params: { props, attrs, index, value: val }
            });
          }
          if (col?.slot && slots[col.slot]) {
            return slots[col.slot]?.({ props, attrs, index, value: val });
          }
          const displayVal = col?.value !== undefined ? unref(col.value) : val;

          return (
            <span class="descriptions-cell-content">
              {displayVal}
              {col?.copy && (
                <span
                  class="cursor-pointer ml-1 text-primary text-xs"
                  onClick={() => handleCopy(displayVal, index)}
                >
                  {activeCopyIndex.value === index && isCopied.value
                    ? "✔ 已复制"
                    : "📋 复制"}
                </span>
              )}
            </span>
          );
        };

        const itemSlots: any = { default: itemDefault };

        if (col?.labelRenderer) {
          itemSlots.label = () =>
            createVNode(Renderer, {
              render: col.labelRenderer!,
              params: { props, attrs, index, value: val }
            });
        }

        return createVNode(
          ElDescriptionsItem,
          mergeProps(col as any, {
            key: index,
            align: col.align || unref(align),
            labelAlign: col.labelAlign || unref(labelAlign)
          }),
          itemSlots
        );
      });

      const loadingDirective = resolveDirective("loading");
      const currentLoading = unref(loading);

      const vnode = createVNode(
        ElDescriptions,
        mergeProps(props, attrs, {
          "element-loading-text": currentLoading?.text ?? "Loading...",
          "element-loading-svg": currentLoading?.svg,
          "element-loading-spinner": currentLoading?.spinner,
          "element-loading-svg-view-box": currentLoading?.svgViewBox,
          "element-loading-background": currentLoading?.background
        }),
        {
          default: () => children,
          ...descSlots
        }
      );

      return loadingDirective
        ? withDirectives(vnode, [[loadingDirective, currentLoading?.load]])
        : vnode;
    };
  }
});
