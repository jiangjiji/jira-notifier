import { create } from "zustand";
import { ChromeLocalStorage } from "zustand-chrome-storage";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "user-setting";

export enum NotificationType {
  None = 0,
  InterBrowser = 1,
  System = 2,
}

export interface ISettingData {
  isOpen: boolean;
  isAutoFocused: boolean;
  notifyType: NotificationType;
  serverURL: string;
  interval: number;
}

export const useSettingStore = create<ISettingData>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isAutoFocused: false,
      notifyType: NotificationType.System,
      serverURL: "http://192.168.1.230:8080",
      interval: 60,
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => ChromeLocalStorage),
    },
  ),
);

if (browser) {
  browser.storage.local.onChanged.addListener((changes) => {
    if (changes[STORAGE_KEY]) {
      useSettingStore.persist.rehydrate();
    }
  });
} else {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      useSettingStore.persist.rehydrate();
    }
  });
}
