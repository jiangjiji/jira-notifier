import { useJiraStore } from "@/src/store/jiraStore";
import { useSettingStore } from "@/src/store/settingStore";
import { JIRAStatus } from "@/src/utils/common/jiraClient";
import { List, Tag } from "antd";
import { Version2Models } from "jira.js";
import cssStyles from "./newbug-layout.module.scss";

const BugItem = (props: {
  index: number;
  issue: Version2Models.Issue;
  length: number;
}) => {
  const serverURL = useSettingStore((state) => state.serverURL);
  const isAutoFocused = useSettingStore((state) => state.isAutoFocused);
  const addIgnore = useJiraStore((state) => state.addIgnore);

  const onClick = () => {
    addIgnore(props.issue);

    // 打开新的一页
    browser.tabs.create({
      url: `${serverURL}/browse/${props.issue.key}`,
      active: isAutoFocused,
    });
  };

  return (
    <div
      className={`${cssStyles.bugItem} ${props.index === 0 && cssStyles.isFirst} ${props.index === props.length - 1 && cssStyles.isLast}`}
      onClick={onClick}
    >
      <div className={cssStyles.bugTitle}>
        <img src={props.issue.fields.priority.iconUrl} />
        <div className={cssStyles.bugKey}>{props.issue.key}</div>
        {props.issue.fields.status.id === JIRAStatus.Reopen && (
          <Tag className={cssStyles.tag} color="warning"> {props.issue.fields.status.name}</Tag>
        )}
      </div>

      <div className={cssStyles.bugContent}>{props.issue.fields.summary}</div>
    </div>
  );
};

function NewBugLayout() {
  const projectInfoList = useJiraStore((state) => state.projectInfoList);
  const issuesList = projectInfoList.reduce<Version2Models.Issue[]>(
    (acc, project) => {
      return acc.concat(project.issues);
    },
    [],
  );

  return (
    <div className={cssStyles.page}>
      <List
        bordered
        dataSource={issuesList}
        renderItem={(item, index) => (
          <List.Item style={{ padding: 0 }}>
            <BugItem index={index} issue={item} length={issuesList.length} />
          </List.Item>
        )}
      />
    </div>
  );
}

export default NewBugLayout;
