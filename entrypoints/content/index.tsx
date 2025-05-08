import { ContentScriptContext } from "#imports";
import { useSettingStore } from "@/src/store/settingStore";
import { RunTimeMessage } from "@/src/utils/common/message";
import showToast from "./content-toast";

function initPage(ctx: ContentScriptContext) {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("🚀 ~ sender:", sender);
    console.log("🚀 ~ message:", message);
    switch (message.type as RunTimeMessage) {
      case RunTimeMessage.ShowToast:
        showToast(ctx, message.message, message.description);
        break;
    }
    sendResponse(RunTimeMessage.ResponseSuccess);
  });
}

function checkLogin(ctx: ContentScriptContext) {
  const url = useSettingStore.getState().serverURL;
  if (!window.location.href.includes(url)) return;

  showToast(ctx, "Jira 未登录", "登录后，自动获取最新的Jira内容");
}

export default defineContentScript({
  matches: ["<all_urls>"],
  main(ctx) {
    checkLogin(ctx);

    initPage(ctx);
  },
});
