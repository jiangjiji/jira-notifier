import { create } from "zustand";
import { ChromeLocalStorage } from "zustand-chrome-storage";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ISettingData {
  isOpen: boolean;
  serverURL: string;
  interval: number;
}

export const useSettingStore = create<ISettingData>()(
  persist(
    (set, get) => ({
      isOpen: true,
      serverURL: "http://192.168.1.230:8080",
      interval: 1,
    }),
    {
      name: "user-setting",
      storage: createJSONStorage(() => ChromeLocalStorage),
    },
  ),
);
