import { useSettingStore } from "@/src/store/settingStore";
import { jiraHelper } from "@/src/utils/common/jiraClient";
import { defineJobScheduler } from "@webext-core/job-scheduler";
import { registerBackgroundService } from "../../src/utils/common/proxyService";

const JIRA_TASK = "jira-task";

async function taskRun() {
  await jiraHelper.refreshUserInfo();

  if (!jiraHelper.checkLogin()) {
    await jiraHelper.gotoLogin();
    return;
  }

  await jiraHelper.getAllUnresolvedIssues();
}

function setJob() {
  const jobs = defineJobScheduler();
  const { isOpen, interval } = useSettingStore.getState();

  if (isOpen) {
    jobs.scheduleJob({
      id: "JIRA_TASK",
      type: "interval",
      duration: 1000 * interval,
      immediate: true,
      execute: taskRun,
    });
  }

  useSettingStore.subscribe((state) => {
    jobs.removeJob(JIRA_TASK);

    if (!state.isOpen) return;

    jobs.scheduleJob({
      id: "JIRA_TASK",
      type: "interval",
      duration: 1000 * state.interval,
      immediate: false,
      execute: taskRun,
    });
  });
}

function initBackground() {
  console.log("🚀 ~ initBackground:");

  registerBackgroundService();

  // TODO 没有触发事件
  browser.notifications.onClicked.addListener(() => {
    console.log("🚀 ~ browser.notifications.onClicked:");
    browser.tabs.create({
      url: useSettingStore.getState().serverURL,
    });
  });

  browser.notifications.onButtonClicked.addListener(() => {
    console.log("🚀 ~ browser.notifications.onClicked:");
    browser.tabs.create({
      url: useSettingStore.getState().serverURL,
    });
  });
}

export default defineBackground({
  type: "module",
  main() {
    initBackground();
    setJob();
  },
});
