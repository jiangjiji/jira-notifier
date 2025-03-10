import { Issue, Project } from "jira.js/out/version2/models";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { jiraClient } from "../utils/common/jiraClient";

export interface IJiraData {
  count: number;
  projectList: Map<string, Project>;
  projectIssues: Map<string, Issue[]>;
}

export const useJiraStore = create<IJiraData>()(
  persist(
    (set, get) => ({
      count: 0,
      projectList: new Map<string, Project>(),
      projectIssues: new Map<string, Issue[]>(),
    }),
    {
      name: "jira-data",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export async function getAllUnresolvedIssues() {
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

  const projectIssues = new Map<string, Issue[]>();
  const projectList = new Map<string, Project>();
  projects.issues!.forEach((issue) => {
    const project = issue.fields.project as Project;
    if (!project.key) return;

    if (!projectList.has(project.key)) {
      projectList.set(project.key, project);
    }

    if (!projectIssues.has(project.key)) {
      projectIssues.set(project.key, []);
    } else {
      projectIssues.get(project.key)!.push(issue);
    }
  });

  useJiraStore.setState({ count: projects.total, projectList, projectIssues });
  console.log("🚀 ~ projectList:", projectList);
  console.log("🚀 ~ projectIssues:", projectIssues);
}
