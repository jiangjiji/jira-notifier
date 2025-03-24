import { useJiraStore } from "@/src/store/jiraStore";
import { useSettingStore } from "@/src/store/settingStore";

import { Avatar, Badge, Collapse } from "antd-mobile";
import { SendOutline } from "antd-mobile-icons";
import cssStyles from "./home-layout.module.scss";

function HomeLayout() {
  const userInfo = useJiraStore((state) => state.userInfo);
  const issueCount = useJiraStore((state) => state.count);
  const projectInfoList = useJiraStore((state) => state.projectInfoList);

  return (
    <div className={cssStyles.page}>
      <div className={cssStyles.title}>
        <div className={cssStyles.left}>
          <Avatar
            className={cssStyles.avatar}
            src={userInfo?.avatarUrls?.["48x48"] ?? ""}
          ></Avatar>
          {userInfo?.displayName}
        </div>
        <div
          className={cssStyles.right}
          title="打开Jira"
          onClick={() => {
            const settingData = useSettingStore.getState();
            window.open(settingData.serverURL);
          }}
        >
          <SendOutline className={cssStyles.open} />
        </div>
      </div>

      <div className={cssStyles.bugCard}>
        <div className={cssStyles.bugCardTitle}>
          <div className={cssStyles.left}>新BUG</div>
          <div className={cssStyles.right}>
            <Badge content={issueCount} />
          </div>
        </div>
        <Collapse accordion className={cssStyles.bugList}>
          {projectInfoList.map((item) => {
            return (
              <Collapse.Panel key={item.key} title={item.name}></Collapse.Panel>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
}

export default HomeLayout;
