import storeSync, {  popupSync } from "@/src/store/storeSync";
import { jiraHelper } from "@/src/utils/common/jiraClient";
import React from "react";
import ReactDOM from "react-dom/client";
import MainLayout from "./component/main-layout";

init();

async function init() {
  console.log("🚀 ~ init");

  await popupSync();

  if (!jiraHelper.checkLogin()) {
    jiraHelper.gotoLogin();
    return;
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <MainLayout />
    </React.StrictMode>,
  );
}
