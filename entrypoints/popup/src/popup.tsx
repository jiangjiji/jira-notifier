import storeSync, { popupSync } from "@/src/store/storeSync";
import { jiraHelper } from "@/src/utils/common/jiraClient";
import { MessageSource } from "@/src/utils/common/messageType";
import React from "react";
import ReactDOM from "react-dom/client";
import MainLayout from "./component/main-layout";

init();

async function init() {
  console.log("🚀 ~ init");

  await popupSync();
  storeSync(MessageSource.Popup);

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
