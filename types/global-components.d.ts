import type { PureDescriptions } from "@/components/ReDescriptions";
import type { AtIcon } from "@/components/ReIcon";
import type { PureTable } from "@/components/RePureTable";

declare module "vue" {
  export interface GlobalComponents {
    PureDescriptions: typeof PureDescriptions;
    AntaDescriptions: typeof PureDescriptions;
    AtIcon: typeof AtIcon;
    PureTable: typeof PureTable;
    "pure-table": typeof PureTable;
  }
}

export {};
