import { jiraHelper } from "@/src/utils/common/jiraClient";
import { Button } from "antd";
import cssStyles from "./login-layout.module.scss";

function LoginLayout() {
  return (
    <div className={cssStyles.page}>
      <img className={cssStyles.logo} src="/icon.svg" alt="" />

      <Button
        className={cssStyles.loginButton}
        type="primary"
        onClick={() => jiraHelper.gotoLogin()}
      >
        {i18n.t("login")}
      </Button>
    </div>
  );
}

export default LoginLayout;
