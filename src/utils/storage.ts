import { isClient } from "./is";

interface ProxyStorage {
  getItem<T = any>(key: string): T | null;
  setItem(key: string, value: any): void;
  removeItem(key: string): void;
  clear(): void;
}

class StorageProxy implements ProxyStorage {
  private storage: Storage | null;

  constructor(storage: Storage | null) {
    this.storage = storage;
  }

  getItem<T = any>(key: string): T | null {
    if (!this.storage) return null;
    const value = this.storage.getItem(key);
    if (value === null || value === undefined) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value as unknown as T;
    }
  }

  setItem(key: string, value: any): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch {
      this.storage.setItem(key, String(value));
    }
  }

  removeItem(key: string): void {
    if (this.storage) {
      this.storage.removeItem(key);
    }
  }

  clear(): void {
    if (this.storage) {
      this.storage.clear();
    }
  }
}

let _localProxy: ProxyStorage | null = null;
let _sessionProxy: ProxyStorage | null = null;

export const storageLocal = (): ProxyStorage => {
  if (!_localProxy) {
    _localProxy = new StorageProxy(isClient ? window.localStorage : null);
  }
  return _localProxy;
};

export const storageSession = (): ProxyStorage => {
  if (!_sessionProxy) {
    _sessionProxy = new StorageProxy(isClient ? window.sessionStorage : null);
  }
  return _sessionProxy;
};
