import { useJiraStore } from "@/src/store/jiraStore";
import { NotificationType, useSettingStore } from "@/src/store/settingStore";
import { Version2Client, Version2Models } from "jira.js";
import { RunTimeMessage } from "./message";

export enum JIRAStatus {
  None = "1",
  Start = "3",
  Reopen = "4",
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
    return useJiraStore.getState().isLoading;
  }

  public async refreshUserInfo() {
    const userInfo = await jiraClient.myself.getCurrentUser();

    if (userInfo) {
      useJiraStore.setState({
        isLoading: true,
        userInfo,
      });
    } else {
      useJiraStore.setState({
        isLoading: false,
        userInfo: null,
      });
    }
  }

  public async getAllUnresolvedIssues() {
    const projects = await jiraClient.issueSearch.searchForIssuesUsingJql({
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

    console.log("🚀 ~ projects:", projects);

    const projectIssues = new Map<string, Version2Models.Issue[]>();
    const projectList = new Map<string, Version2Models.Project>();
    projects.issues!.forEach((issue) => {
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

    this.processList(projectInfoList);
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

  public processList(projectInfoList: IProjectData[]) {
    const { ignoreList, noticedList } = useJiraStore.getState();
    const needNoticeList = new Array<Version2Models.Issue>();

    projectInfoList.forEach((project) => {
      project.issues = project.issues.filter(
        (issue) => !ignoreList.includes(issue.key),
      );
      project.count = project.issues.length;
    });

    projectInfoList = projectInfoList.filter((project) => project.count > 0);

    const count = projectInfoList.reduce((acc, cur) => acc + cur.count, 0);

    projectInfoList.forEach((project) => {
      project.issues.forEach((issue) => {
        if (noticedList.includes(issue.key)) return;
        noticedList.push(issue.key);
        needNoticeList.push(issue);
      });
    });

    this.noticeIssues(needNoticeList);
    useJiraStore.setState({ count, projectInfoList, noticedList });
  }

  public noticeIssues(list: Version2Models.Issue[]) {
    if (list.length === 0) return;
    const { notifyType } = useSettingStore.getState();
    const title = `新增了${list.length}个bug，请及时查看！`;
    const message = `${list[0].key} ${list[0].fields.summary}`;

    switch (notifyType) {
      case NotificationType.None:
        return;
      case NotificationType.System:
        browser.notifications.create({
          iconUrl: "wxt.svg",
          type: "basic",
          title,
          message,
          buttons: [
            {
              title: "查看",
            },
          ],
          requireInteraction: true,
          isClickable: true,
        });
        break;
      case NotificationType.InterBrowser:
        browser.runtime.sendMessage({
          type: RunTimeMessage.ShowToast,
          message: title,
          description: message,
        });
        break;
    }
  }
}

export const jiraHelper = new JiraHelper();
// #endregion
