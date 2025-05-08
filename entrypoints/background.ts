import { useSettingStore } from "@/src/store/settingStore";
import { jiraHelper } from "@/src/utils/common/jiraClient";
import { RunTimeMessage } from "@/src/utils/common/message";
import { defineJobScheduler } from "@webext-core/job-scheduler";

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

  // TODO
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

  browser.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      console.log("🚀 ~ sender:", sender);
      console.log("🚀 ~ message:", message);

      const tabs = await browser.tabs.query({});

      switch (message.type as RunTimeMessage) {
        case RunTimeMessage.ShowToast:
          tabs.forEach((tab) => {
            if (tab.id) {
              // 向内容脚本发送消息
              browser.tabs.sendMessage(tab.id, message);
            }
          });
          break;
      }

      sendResponse(RunTimeMessage.ResponseSuccess);
    },
  );
}

export default defineBackground({
  type: "module",
  main() {
    initBackground();
    taskRun();
    setJob();
  },
});
