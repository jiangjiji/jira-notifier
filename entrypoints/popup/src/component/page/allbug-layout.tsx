import { useJiraStore } from "@/src/store/jiraStore";

import { IProjectData, JIRAStatus } from "@/src/utils/common/jiraClient";
import {
  CheckOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Badge, Collapse, Divider, List, Space, Tooltip } from "antd";
import { Version2Models } from "jira.js";
import cssStyles from "./allbug-layout.module.scss";

const BugItem = (props: { item: Version2Models.Issue }) => {
  const addIgnore = useJiraStore((state) => state.addIgnore);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleIgnore = () => {
    setIsRemoving(true); // 开始动画

    // 等待动画完成后执行忽略操作
    setTimeout(() => {
      addIgnore(props.item);
    }, 200);
  };

  return (
    <>
      <div
        className={`${cssStyles.bugItem} ${isRemoving && cssStyles.removing}`}
      >
        <div className={cssStyles.bugKey}>
          {props.item.key}

          {props.item.fields.status?.id === JIRAStatus.None && (
            <Badge
              dot
              style={{ transform: "translateY(-8px) translateX(2px)" }}
            />
          )}

          {props.item.fields.status?.id === JIRAStatus.Reopen && (
            <Badge
              dot
              style={{ transform: "translateY(-8px) translateX(2px)" }}
              color="yellow"
            />
          )}
        </div>
        <Space
          className={cssStyles.bugSummary}
          title={props.item.fields.summary}
        >
          {props.item.fields.summary}
        </Space>
        <Space className={cssStyles.bugAction}>
          <Space>
            <Divider type="vertical" />
            <Tooltip title="忽略">
              <StopOutlined
                className={cssStyles.actionIcon}
                style={{ color: "#ff4d4f" }}
                onClick={handleIgnore}
              />
            </Tooltip>
          </Space>
          <Space>
            <Divider type="vertical" />
            <Tooltip title="开始处理">
              <ClockCircleOutlined
                className={cssStyles.actionIcon}
                style={{ color: "#108ee9" }}
              />
            </Tooltip>
          </Space>
          <Space>
            <Divider type="vertical" />
            <Tooltip title="已处理">
              <CheckOutlined
                className={cssStyles.actionIcon}
                style={{ color: "#52c41a" }}
              />
            </Tooltip>
          </Space>
        </Space>
      </div>
    </>
  );
};

const generateItems = (projectInfoList: IProjectData[]) => {
  return projectInfoList.map((projectInfo) => {
    return {
      key: projectInfo.key,
      label: projectInfo.name,
      extra: <Badge count={projectInfo.count} />,
      styles: {
        body: {
          padding: "0 8px",
        },
      },
      children: (
        <List
          size="small"
          dataSource={projectInfo.issues}
          renderItem={(item) => (
            <List.Item style={{ padding: "6px 0" }}>
              {<BugItem item={item} />}
            </List.Item>
          )}
        />
      ),
    };
  });
};

function AllBugLayout() {
  const projectInfoList = useJiraStore((state) => state.projectInfoList);

  return (
    <div className={cssStyles.page}>
      <div className={cssStyles.bugCard}>
        <Collapse
          className={cssStyles.bugList}
          size="small"
          expandIconPosition="end"
          items={generateItems(projectInfoList)}
          defaultActiveKey={[projectInfoList[0].key]}
          accordion
        ></Collapse>
      </div>
    </div>
  );
}

export default AllBugLayout;
