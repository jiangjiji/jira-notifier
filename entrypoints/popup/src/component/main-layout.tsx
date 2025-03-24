import storeSync from "@/src/store/storeSync";
import { jiraHelper } from "@/src/utils/common/jiraClient";
import { MessageSource } from "@/src/utils/common/messageType";
import { useAsyncEffect } from "ahooks";
import { TabBar } from "antd-mobile";
import {
  AppstoreOutline,
  MessageOutline,
  MoreOutline,
  UnorderedListOutline,
} from "antd-mobile-icons";
import {
  HashRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HomeLayout from "./home-layout";
import cssStyles from "./main-layout.module.scss";
import SettingLayout from "./setting-layout";

function MainLayout() {
  useAsyncEffect(async () => {
    storeSync(MessageSource.Popup);

    await jiraHelper.refreshUserInfo();
    if (!jiraHelper.checkLogin()) {
      jiraHelper.gotoLogin();
      return;
    }

    await jiraHelper.getAllUnresolvedIssues();
  }, []);

  return (
    <HashRouter>
      <div className={cssStyles.app}>
        {/* <div className={cssStyles.top}></div> */}
        <div className={cssStyles.body}>
          <Routes>
            <Route path="/" element={<HomeLayout />} />
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
      title: "News",
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
