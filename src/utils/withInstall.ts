import type { App, Plugin } from "vue";

export type SFCWithInstall<T> = T & Plugin;

export const withInstall = <T, E extends Record<string, any>>(
  main: T,
  extra?: E
) => {
  (main as SFCWithInstall<T>).install = (app: App): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component((comp as any).name || (comp as any).displayName, comp);
    }
  };

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp;
    }
  }
  return main as SFCWithInstall<T> & E;
};

export const withInstallFunction = <T>(fn: T, name: string) => {
  (fn as SFCWithInstall<T>).install = (app: App) => {
    (app.config.globalProperties as Record<string, any>)[name] = fn;
  };
  return fn as SFCWithInstall<T>;
};

export const withNoopInstall = <T>(component: T) => {
  (component as SFCWithInstall<T>).install = () => {};
  return component as SFCWithInstall<T>;
};
