import { i18n } from "#imports";
import { useJiraStore } from "@/src/store/jiraStore";
import { NotificationType, useSettingStore } from "@/src/store/settingStore";
import { Version2Client, Version2Models } from "jira.js";
import { getBackgroundService } from "./proxyService";

export enum JIRAStatus {
  None = "1",
  Start = "3",
  Reopen = "4",
  Investigating = "5",
}

// #region 类型定义
export interface IProjectData {
  count: number;
  issues: Version2Models.Issue[];
  key: string;
  name: string;
  url: string;
}

// #endregion

// #region 初始化JiraClient
const clientOptions = {
  host: "http://192.168.1.230:8080",
};

const jiraClient = new Version2Client(clientOptions);

jiraClient.handleFailedResponse = (response) => {
  console.log("handleFailedResponse", response);
};
// #endregion

// #region 初始化JiraHelper
class JiraHelper {
  public async gotoLogin() {
    const url = useSettingStore.getState().serverURL + "/*";
    const tabs = await browser.tabs.query({ url });

    if (tabs.length > 0) {
      browser.tabs.update(tabs[0].id!, { active: true });
    } else {
      browser.tabs.create({
        url: useSettingStore.getState().serverURL,
      });
    }
  }

  public checkLogin() {
    return useJiraStore.getState().isLogin;
  }

  public async refreshUserInfo() {
    const userInfo = await jiraClient.myself.getCurrentUser();

    if (userInfo) {
      useJiraStore.setState({
        isLogin: true,
        userInfo,
      });
    } else {
      useJiraStore.setState({
        isLogin: false,
        userInfo: null,
        count: 0,
      });
    }
  }

  public async getAllUnresolvedIssues() {
    const respondList = await jiraClient.issueSearch.searchForIssuesUsingJql({
      jql: "resolution = Unresolved AND assignee in (currentUser())",
      fields: [
        "summary",
        "description",
        "status",
        "updated",
        "project",
        "priority",
        "reporter",
      ],
      maxResults: 1000,
    });

    console.log("🚀 ~ projects:", respondList);

    const projectIssues = new Map<string, Version2Models.Issue[]>();
    const projectList = new Map<string, Version2Models.Project>();
    respondList.issues!.forEach((issue) => {
      const project = issue.fields.project as Version2Models.Project;
      if (!project.key) return;

      if (!projectList.has(project.key)) {
        projectList.set(project.key, project);
      }

      if (!projectIssues.has(project.key)) {
        projectIssues.set(project.key, [issue]);
      } else {
        projectIssues.get(project.key)!.push(issue);
      }
    });

    console.log("🚀 ~ projectList:", projectList);
    console.log("🚀 ~ projectIssues:", projectIssues);

    const projectInfoList = [];
    for (const [key, value] of projectList) {
      const info = {
        count: projectIssues.get(key)!.length,
        key,
        name: value.name!,
        url: value.self!,
        issues: projectIssues.get(key)!,
      };

      projectInfoList.push(info);
    }

    this.processList(projectInfoList, respondList.issues);
  }

  public async setIssuesStatus(issueKey: string, status: JIRAStatus) {
    try {
      const response = await jiraClient.issues.doTransition({
        issueIdOrKey: issueKey,
        transition: {
          id: status,
        },
      });
      console.log("Issue transitioned successfully:", response);
      return response;
    } catch (error) {
      console.error("Error transitioning issue:", error);
      throw error;
    }
  }

  public processList(
    projectInfoList: IProjectData[],
    issuesList?: Version2Models.Issue[],
  ) {
    const { ignoreList: prevIgnoreList, noticedList: prevNoticeList } =
      useJiraStore.getState();
    const needNoticeList = new Array<Version2Models.Issue>();

    let ignoreList = prevIgnoreList;
    let noticedList = prevNoticeList;
    //如果是重新拉取的话 把已经处理的bug 就移出掉
    if (issuesList) {
      ignoreList = prevIgnoreList.filter((ignore) => {
        return issuesList.some((issue) => issue.key === ignore);
      });
      noticedList = prevNoticeList.filter((notice) => {
        return issuesList.some((issue) => issue.key === notice);
      });
    }

    // 已经忽略的就 不要显示了
    projectInfoList.forEach((project) => {
      project.issues = project.issues.filter(
        (issue) => !ignoreList.includes(issue.key),
      );
      project.count = project.issues.length;
    });

    projectInfoList = projectInfoList.filter((project) => project.count > 0);

    const count = projectInfoList.reduce((acc, cur) => acc + cur.count, 0);

    // 提取未通知的
    let newCount = 0;
    let reopenCount = 0;
    projectInfoList.forEach((project) => {
      project.issues.forEach((issue) => {
        if (noticedList.includes(issue.key)) return;

        if (issue.fields.status.id === JIRAStatus.None) newCount++;
        else reopenCount++;

        noticedList.push(issue.key);
        needNoticeList.push(issue);
      });
    });

    this.noticeIssues(needNoticeList, newCount, reopenCount);

    useJiraStore.setState({
      count,
      projectInfoList,
      ignoreList,
      noticedList,
    });
  }

  public noticeIssues(
    list: Version2Models.Issue[],
    newCount: number,
    reopenCount: number,
  ) {
    if (list.length === 0) return;
    const { notifyType } = useSettingStore.getState();

    const parts = [];
    if (newCount > 0) parts.push(i18n.t("noticeNewCount", newCount));
    if (reopenCount > 0) parts.push(i18n.t("noticeReopenCount", reopenCount));
    parts.push(i18n.t("noticeDes"));

    const title = parts.join("，");
    const message = `${list[0].key} ${list[0].fields.summary}`;

    switch (notifyType) {
      case NotificationType.None:
        return;
      case NotificationType.System:
        browser.notifications.create({
          iconUrl: "icon.svg",
          type: "basic",
          title,
          message,
          buttons: [
            {
              title: i18n.t("noticeBtn"),
            },
          ],
          requireInteraction: true,
          isClickable: true,
        });
        break;
      case NotificationType.InterBrowser:
        getBackgroundService().showToast(title, message);
        break;
    }
  }
}

export const jiraHelper = new JiraHelper();
// #endregion
