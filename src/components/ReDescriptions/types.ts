import type { VNode } from "vue";
import type { DescriptionProps as IDescriptionsProps } from "element-plus";

export interface Loading {
  load?: boolean;
  text?: string;
  svg?: string;
  spinner?: string;
  svgViewBox?: string;
  background?: string;
}

export type DescriptionsAlign = "left" | "center" | "right";

export interface DescriptionsColumns {
  prop?: string;
  label?: string;
  span?: number;
  width?: string | number;
  minWidth?: string | number;
  align?: DescriptionsAlign;
  labelAlign?: DescriptionsAlign;
  className?: string;
  labelClassName?: string;
  value?: any;
  slot?: string;
  copy?: boolean;
  hide?: boolean | ((attrs?: any) => boolean);
  cellRenderer?: (params: {
    props?: any;
    attrs?: any;
    index?: number;
    value?: any;
  }) => VNode | any;
  labelRenderer?: (params: {
    props?: any;
    attrs?: any;
    index?: number;
    value?: any;
  }) => VNode | any;
}

export interface PureDescriptionsProps extends Partial<IDescriptionsProps> {
  data?: Array<Record<string, any>>;
  columns?: Array<DescriptionsColumns>;
  loading?: Loading;
  align?: DescriptionsAlign;
  labelAlign?: DescriptionsAlign;
}
