import type { App } from "vue";
import { PureDescriptions } from "./src/index";

export * from "./types";
export { PureDescriptions };
export const AntaDescriptions = PureDescriptions;

export const withInstallDescriptions = Object.assign(PureDescriptions, {
  install(app: App) {
    app.component("PureDescriptions", PureDescriptions);
    app.component("AntaDescriptions", PureDescriptions);
  }
});

export default withInstallDescriptions;
