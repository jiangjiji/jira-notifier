import { User } from "jira.js/out/version2/models";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useInfoStore = create<User>()(
  persist(
    (set, get) => ({
      self: "",
      key: "",
      name: "",
      emailAddress: "",
      avatarUrls: {
        "48x48": "",
        "24x24": "",
        "16x16": "",
        "32x32": "",
      },
      displayName: "",
      active: false,
      timeZone: "",
      groups: {},
      expand: "",
    }),
    {
      name: "user-info",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
