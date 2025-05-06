import { Version2Models } from "jira.js";
import { create } from "zustand";
import { ChromeLocalStorage } from "zustand-chrome-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { IProjectData } from "../utils/common/jiraClient";

export interface IJiraData {
  count: number;
  isLoading: boolean;
  userInfo: Version2Models.User | null;
  projectInfoList: IProjectData[];
}

export const useJiraStore = create<IJiraData>()(
  persist(
    (set, get) => ({
      count: 0,
      isLoading: false,
      projectInfoList: [],
      userInfo: null,
    }),
    {
      name: "jira-data",
      storage: createJSONStorage(() => ChromeLocalStorage),
    },
  ),
);
