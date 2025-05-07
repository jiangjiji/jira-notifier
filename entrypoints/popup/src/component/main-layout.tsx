import { useAsyncEffect } from "ahooks";
import { Avatar } from "antd";
import { TabBar } from "antd-mobile";
import {
  AppstoreOutline,
  MessageOutline,
  MoreOutline,
  SendOutline,
  UnorderedListOutline,
} from "antd-mobile-icons";
import {
  HashRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import cssStyles from "./main-layout.module.scss";
import NewBugLayout from "./page/newbug-layout";
import SettingLayout from "./page/setting-layout";

import { useJiraStore } from "@/src/store/jiraStore";
import { useSettingStore } from "@/src/store/settingStore";
import { jiraHelper } from "@/src/utils/common/jiraClient";

function MainLayout() {
  useAsyncEffect(async () => {
    // 手动刷新一次数据
    await jiraHelper.refreshUserInfo();
    if (!jiraHelper.checkLogin()) {
      await jiraHelper.gotoLogin();
      return;
    }

    await jiraHelper.getAllUnresolvedIssues();

    console.timeEnd("🚀 ~ init");
  }, []);

  return (
    <HashRouter>
      <div className={cssStyles.app}>
        <Header />
        <div className={cssStyles.body}>
          <Routes>
            <Route path="/" element={<NewBugLayout />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/message" element={<Message />} />
            <Route path="/setting" element={<SettingLayout />} />
          </Routes>
        </div>
        <div className={cssStyles.bottom}>
          <Bottom />
        </div>
      </div>
    </HashRouter>
  );
}

function Header() {
  const userInfo = useJiraStore((state) => state.userInfo);

  return (
    <div className={cssStyles.title}>
      <div className={cssStyles.left}>
        <Avatar
          className={cssStyles.avatar}
          src={userInfo?.avatarUrls?.["48x48"] ?? ""}
        />
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
  );
}

function Bottom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const setRouteActive = (value: string) => {
    navigate(value);
  };

  const tabs = [
    {
      key: "/",
      title: "新Bug",
      icon: <AppstoreOutline />,
    },
    {
      key: "/todo",
      title: "待办",
      icon: <UnorderedListOutline />,
    },
    {
      key: "/message",
      title: "消息",
      icon: <MessageOutline />,
    },
    {
      key: "/setting",
      title: "设置",
      icon: <MoreOutline />,
    },
  ];

  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
}

function Todo() {
  return <div>待办</div>;
}

function Message() {
  return <div>消息</div>;
}

export default MainLayout;
