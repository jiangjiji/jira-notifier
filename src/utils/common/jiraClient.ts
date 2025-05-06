import { useJiraStore } from "@/src/store/jiraStore";
import { useSettingStore } from "@/src/store/settingStore";
import { Version2Client, Version2Models } from "jira.js";

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
      startAt: 0,
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

    const projectInfoList = new Array<IProjectData>();
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
    useJiraStore.setState({ count: projects.total, projectInfoList });
    console.log("🚀 ~ projectInfoList:", projectInfoList);
  }
}

export const jiraHelper = new JiraHelper();
// #endregion
