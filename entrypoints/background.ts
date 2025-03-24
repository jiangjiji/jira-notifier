import { useSettingStore } from "@/src/store/settingStore";
import storeSync from "@/src/store/storeSync";
import { jiraHelper } from "@/src/utils/common/jiraClient";
import {
  MessageAction,
  MessageSource,
  RuntimeMessageEvent,
  addMessageListener,
} from "@/src/utils/common/messageType";

const JIRA_TASK = "jira-task";
let timerID: NodeJS.Timeout;

async function taskRun() {
  if (jiraHelper.checkLogin()) await jiraHelper.refreshUserInfo();

  if (!jiraHelper.checkLogin()) {
    await jiraHelper.gotoLogin();
    return;
  }

  await jiraHelper.getAllUnresolvedIssues();
}

function setAlarms() {
  browser.alarms.create(JIRA_TASK, {
    periodInMinutes: 1,
  });

  browser.alarms.onAlarm.addListener((alarm) => {
    console.log("🚀 ~ alarm:", alarm);
    if (alarm.name === JIRA_TASK) taskRun();
  });

  useSettingStore.subscribe((newState, oldState) => {
    if (newState.interval !== oldState.interval) {
      browser.alarms.clear(JIRA_TASK);
      browser.alarms.create(JIRA_TASK, {
        periodInMinutes: 1,
      });
    }
  });
}

function handleMessage(message: RuntimeMessageEvent) {
  if (message.action === MessageAction.JiraViewing) {
    if (message.isOpen) {
      clearInterval(timerID);

      timerID = setInterval(async () => {
        if (!jiraHelper.checkLogin()) await jiraHelper.refreshUserInfo();
      }, 1000);
    } else {
      clearInterval(timerID);
    }
  }
}

export default defineBackground({
  type: "module",
  main() {
    storeSync(MessageSource.BackgroundScript);

    taskRun();
    setAlarms();

    addMessageListener(handleMessage);
  },
});
