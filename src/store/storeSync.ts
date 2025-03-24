import { isEqual } from "lodash-es";
import {
  MessageAction,
  MessageSource,
  addMessageListener,
  sendMessage,
} from "../utils/common/messageType";
import { useJiraStore } from "./jiraStore";
import { useSettingStore } from "./settingStore";

export default function storeSync(source: MessageSource) {
  addMessageListener((request) => {
    if (request.source === source) return;

    if (request.action === MessageAction.JiraStoreChanged) {
      useJiraStore.setState(request.state);
    } else if (request.action === MessageAction.SettingStoreChanged) {
      useSettingStore.setState(request.state);
    }
  });

  useJiraStore.subscribe((newState, oldState) => {
    if (isEqual(newState, oldState)) return;

    sendMessage({
      action: MessageAction.JiraStoreChanged,
      state: newState,
      source: source,
    });
  });

  useSettingStore.subscribe((newState, oldState) => {
    if (isEqual(newState, oldState)) return;

    sendMessage({
      action: MessageAction.SettingStoreChanged,
      state: newState,
      source: source,
    });
  });
}

export async function popupSync() {
  const options = await useJiraStore.persist.getOptions();
  const state = await browser.storage.local.get(options.name);
  useJiraStore.setState(state);
}
