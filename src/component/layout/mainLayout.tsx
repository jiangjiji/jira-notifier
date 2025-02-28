import { NavBar, TabBar } from "antd-mobile";
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
import cssStyles from "./mainLayout.module.scss";

function MainLayout() {
  return (
    <HashRouter>
      <div className={cssStyles.app}>
        <div className={cssStyles.top}>
          <NavBar backIcon={false}>配合路由使用</NavBar>
        </div>
        <div className={cssStyles.body}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/message" element={<Message />} />
            <Route path="/setting" element={<Setting />} />
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

function Home() {
  return <div>首页</div>;
}

function Todo() {
  return <div>待办</div>;
}

function Message() {
  return <div>消息</div>;
}

function Setting() {
  return <div>设置</div>;
}

export default MainLayout;
