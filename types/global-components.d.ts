import type { PureDescriptions } from "@/components/ReDescriptions";

declare module "vue" {
  export interface GlobalComponents {
    PureDescriptions: typeof PureDescriptions;
    AntaDescriptions: typeof PureDescriptions;
  }
}

export {};
