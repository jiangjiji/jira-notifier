import { useJiraStore } from "@/src/store/jiraStore";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";

import { IProjectData } from "@/src/utils/common/jiraClient";
import { Badge, Collapse, List, Space } from "antd";
import React from "react";
import cssStyles from "./newbug-layout.module.scss";

const IconText = (props: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(props.icon)}
    {props.text}
  </Space>
);

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
            <List.Item
              style={{ padding: "6px 0" }}
              actions={[
                <IconText
                  icon={StarOutlined}
                  text="156"
                  key="list-vertical-star-o"
                />,
                <IconText
                  icon={LikeOutlined}
                  text="156"
                  key="list-vertical-like-o"
                />,
                <IconText
                  icon={MessageOutlined}
                  text="2"
                  key="list-vertical-message"
                />,
              ]}
            >
              {
                <div style={{ display: "flex" }}>
                  <div style={{ minWidth: "80px" }}>{item.key}</div>
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={item.fields.summary}
                  >
                    {item.fields.summary}
                  </div>
                </div>
              }
            </List.Item>
          )}
        />
      ),
    };
  });
};

function NewBugLayout() {
  const projectInfoList = useJiraStore((state) => state.projectInfoList);

  return (
    <div className={cssStyles.page}>
      <div className={cssStyles.bugCard}>
        <Collapse
          className={cssStyles.bugList}
          size="small"
          expandIconPosition="end"
          items={generateItems(projectInfoList)}
          accordion
        ></Collapse>
      </div>
    </div>
  );
}

export default NewBugLayout;
