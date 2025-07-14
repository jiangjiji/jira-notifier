import { Version2Models } from "jira.js";
import { create } from "zustand";
import { ChromeLocalStorage } from "zustand-chrome-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { IProjectData, jiraHelper } from "../utils/common/jiraClient";

const STORAGE_KEY = "jira-data";
interface IJiraData {
  count: number;
  isLogin: boolean;
  isOffLine: boolean;
  userInfo: Version2Models.User | null;
  projectInfoList: IProjectData[];
  ignoreList: string[];
  noticedList: string[];
}

interface IJiraActions {
  addIgnore: (issue: Version2Models.Issue) => void;
  ignoreAll: () => void;
  clearIgnore: () => void;
}

export const useJiraStore = create<IJiraData & IJiraActions>()(
  persist(
    (set, get) => ({
      count: 0,
      isLogin: false,
      isOffLine: false,
      projectInfoList: [],
      ignoreList: [],
      noticedList: [],
      userInfo: null,

      addIgnore: (issue: Version2Models.Issue) => {
        const ignoreList = structuredClone(get().ignoreList);
        if (ignoreList.includes(issue.key)) return;
        ignoreList.push(issue.key);
        set({ ignoreList });

        const projectInfoList = structuredClone(get().projectInfoList);
        jiraHelper.processList(projectInfoList);
      },
      clearIgnore: () => {
        set({ ignoreList: [], noticedList: [] });
        jiraHelper.getAllUnresolvedIssues();
      },
      ignoreAll: () => {
        const allIssues = get().projectInfoList.flatMap((item) => item.issues);
        const ignoreList = allIssues.map((item) => item.key);
        set({ ignoreList });

        const projectInfoList = structuredClone(get().projectInfoList);
        jiraHelper.processList(projectInfoList);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => ChromeLocalStorage),
    },
  ),
);

useJiraStore.subscribe((state, prevState) => {
  if (state.count !== prevState.count)
    browser.action.setBadgeText({ text: state.count.toString() });
});

// TODO 触发了两次有待调查
if (browser) {
  browser.storage.local.onChanged.addListener((changes) => {
    if (changes[STORAGE_KEY]) {
      console.log("🚀 ~ Background Storage has changed", changes[STORAGE_KEY]);

      useJiraStore.persist.rehydrate();
    }
  });
} else {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      console.log("🚀 ~ Client Storage has changed", event);

      useJiraStore.persist.rehydrate();
    }
  });
}
