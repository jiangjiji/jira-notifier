import { useSettingStore } from "@/src/store/settingStore";
import { jiraHelper } from "@/src/utils/common/jiraClient";
import { defineJobScheduler } from "@webext-core/job-scheduler";

const JIRA_TASK = "jira-task";

async function taskRun() {
  if (jiraHelper.checkLogin()) await jiraHelper.refreshUserInfo();

  if (!jiraHelper.checkLogin()) {
    await jiraHelper.gotoLogin();
    return;
  }

  await jiraHelper.getAllUnresolvedIssues();
}

function setJob() {
  const jobs = defineJobScheduler();
  jobs.scheduleJob({
    id: "JIRA_TASK",
    type: "interval",
    duration: 1,
    immediate: true,
    execute: taskRun,
  });

  useSettingStore.subscribe((newState, oldState) => {
    if (newState.interval !== oldState.interval) {
      jobs.removeJob(JIRA_TASK);

      jobs.scheduleJob({
        id: "JIRA_TASK",
        type: "interval",
        duration: 1,
        immediate: false,
        execute: taskRun,
      });
    }
  });
}

export default defineBackground({
  type: "module",
  main() {
    taskRun();
    setJob();
  },
});
