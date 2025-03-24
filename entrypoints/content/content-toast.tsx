import { notification } from "antd";

function ContentToast() {
  useEffect(() => {
    notification.open({
      message: "JIRA 需要重新登录",
      description: "T",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  });

  return null;
}

export default ContentToast;
