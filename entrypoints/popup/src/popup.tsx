import { jiraHelper } from "@/src/utils/common/jiraClient";
import React from "react";
import ReactDOM from "react-dom/client";
import MainLayout from "./component/main-layout";

init();

async function init() {
  console.log("🚀 ~ init");

  if (!jiraHelper.checkLogin()) {
    await jiraHelper.gotoLogin();
    return;
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <MainLayout />
    </React.StrictMode>,
  );
}
