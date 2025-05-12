import { useAsyncEffect } from "ahooks";
import { Avatar, Tooltip } from "antd";
import {
  HashRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import cssStyles from "./main-layout.module.scss";
import SettingLayout from "./page/setting-layout";

import { LeftOutlined, SettingOutlined } from "@ant-design/icons";

import { useJiraStore } from "@/src/store/jiraStore";
import { useSettingStore } from "@/src/store/settingStore";
import { jiraHelper } from "@/src/utils/common/jiraClient";
import NewBugLayout from "./page/newbug-layout";

function MainLayout() {
  useAsyncEffect(async () => {
    // 手动刷新一次数据
    await jiraHelper.refreshUserInfo();
    if (!jiraHelper.checkLogin()) {
      await jiraHelper.gotoLogin();
      return;
    }

    await jiraHelper.getAllUnresolvedIssues();
  }, []);

  return (
    <HashRouter>
      <div className={cssStyles.app}>
        <Header />
        <div className={cssStyles.body}>
          <Routes>
            <Route path="/" element={<NewBugLayout />} />
            <Route path="/setting" element={<SettingLayout />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

function Header() {
  const serverURL = useSettingStore((state) => state.serverURL);
  const userInfo = useJiraStore((state) => state.userInfo);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/setting") {
    return (
      <div className={cssStyles.headerBack}>
        <div
          className={cssStyles.title}
          onClick={() => {
            navigate("/");
          }}
        >
          <LeftOutlined className={cssStyles.icon} style={{ fontSize: 16 }} />
          <span className={cssStyles.clickable}>{i18n.t("back")} </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={cssStyles.header}>
        <div className={cssStyles.left}>
          <div className={cssStyles.title}>
            <Avatar
              className={cssStyles.clickable}
              size={28}
              src={userInfo?.avatarUrls?.["48x48"] ?? ""}
              onClick={() => browser.tabs.create({ url: serverURL })}
            />
            <span
              className={cssStyles.clickable}
              onClick={() => browser.tabs.create({ url: serverURL })}
            >
              {userInfo?.displayName}
            </span>
          </div>
        </div>
        <div className={cssStyles.right}>
          <Tooltip title={i18n.t("setting")}>
            <SettingOutlined
              className={cssStyles.icon}
              onClick={() => navigate("/setting")}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default MainLayout;
