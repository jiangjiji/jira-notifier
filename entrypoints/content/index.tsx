import { ContentScriptContext } from "#imports";
import { onMessage } from "@/src/utils/common/messageService";
import { getBackgroundService } from "../../src/utils/common/proxyService";
import showToast from "./content-toast";

function initPage(ctx: ContentScriptContext) {
  onMessage("showToast", (message) => {
    showToast(ctx, message.data.title, message.data.description);
  });
}

async function checkLogin(ctx: ContentScriptContext) {
  const service = getBackgroundService();
  const jiraStore = await service.getJiraStore();
  const settingStore = await service.getSettingStore();

  const isLogin = jiraStore.isLogin;
  if (isLogin) return;
  const url = settingStore.serverURL;
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
