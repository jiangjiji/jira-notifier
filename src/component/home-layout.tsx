import { Avatar, Badge, Card } from "antd-mobile";
import { SendOutline } from "antd-mobile-icons";
import { useJiraStore } from "../store/jiraStore";
import { useSettingStore } from "../store/settingStore";
import { useInfoStore } from "../store/userStore";
import cssStyles from "./home-layout.module.scss";

function HomeLayout() {
  const userName = useInfoStore((state) => state.displayName);
  const userAvatar = useInfoStore((state) => state.avatarUrls?.["48x48"]);
  const issueCount = useJiraStore((state) => state.count);

  return (
    <div className={cssStyles.page}>
      <div className={cssStyles.title}>
        <div className={cssStyles.left}>
          <Avatar className={cssStyles.avatar} src={userAvatar ?? ""}></Avatar>
          {userName}
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

      <Card
        title="新BUG"
        className={cssStyles.bugCard}
        extra={<Badge content={issueCount} />}
      ></Card>
    </div>
  );
}

export default HomeLayout;
