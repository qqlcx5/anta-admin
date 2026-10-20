import type { App } from "vue";
import Table from "./src/table";
import type { PureTableInstallOptions } from "./types";

export const PureTable = Object.assign(Table, {
  install: (app: App, options?: PureTableInstallOptions) => {
    app.component(Table.name, Table);
    app.component("pure-table", Table);
    app.provide("locale", options ?? { locale: null, i18n: null, ssr: false });
  }
});

export const RePureTable = PureTable;
export default PureTable;

export * from "./types";
export * from "./locale";
