import MainLayout from "@/src/component/main-layout.tsx";
import { useInfoStore } from "@/src/store/userStore";
import { jiraClient } from "@/src/utils/common/jiraClient";
import { Toast } from "antd-mobile";
import React from "react";
import ReactDOM from "react-dom/client";
import { getAllUnresolvedIssues } from "./store/jiraStore";

initComponent();
initJIRA();

function initComponent() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <MainLayout />
    </React.StrictMode>,
  );
}

async function initJIRA() {
  const userInfo = await jiraClient.myself.getCurrentUser();
  console.log("🚀 ~ userInfo:", userInfo);

  if (userInfo) {
    useInfoStore.setState(userInfo);
  } else {
    Toast.show({
      content: `未检测到登录`,
      position: "bottom",
    });
  }

  getAllUnresolvedIssues();
}
