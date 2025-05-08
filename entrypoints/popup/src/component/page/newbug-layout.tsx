import { useJiraStore } from "@/src/store/jiraStore";
import { useSettingStore } from "@/src/store/settingStore";
import { List } from "antd";
import { Version2Models } from "jira.js";
import cssStyles from "./newbug-layout.module.scss";

const BugItem = (props: {
  index: number;
  item: Version2Models.Issue;
  length: number;
}) => {
  const serverURL = useSettingStore((state) => state.serverURL);
  const isAutoFocused = useSettingStore((state) => state.isAutoFocused);
  const addIgnore = useJiraStore((state) => state.addIgnore);

  const onClick = () => {
    addIgnore(props.item);

    // 打开新的一页
    browser.tabs.create({
      url: `${serverURL}/browse/${props.item.key}`,
      active: isAutoFocused,
    });
  };

  return (
    <div
      className={`${cssStyles.bugItem} ${props.index === 0 && cssStyles.isFirst} ${props.index === props.length - 1 && cssStyles.isLast}`}
      onClick={onClick}
    >
      <div className={cssStyles.bugTitle}>
        <img src={props.item.fields.priority.iconUrl} />
        <div className={cssStyles.bugKey}>{props.item.key}</div>
      </div>

      <div className={cssStyles.bugContent}>{props.item.fields.summary}</div>
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
            <BugItem index={index} item={item} length={issuesList.length} />
          </List.Item>
        )}
      />
    </div>
  );
}

export default NewBugLayout;
