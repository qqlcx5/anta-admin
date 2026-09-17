import type { PureDescriptions } from "@/components/ReDescriptions";
import type { AtIcon } from "@/components/ReIcon";

declare module "vue" {
  export interface GlobalComponents {
    PureDescriptions: typeof PureDescriptions;
    AntaDescriptions: typeof PureDescriptions;
    AtIcon: typeof AtIcon;
  }
}

export {};
