import { IJiraData } from "@/src/store/jiraStore";
import { ISettingData } from "@/src/store/settingStore";

export enum MessageSource {
  BackgroundScript = "background_script",
  ContentScript = "content_script",
  Popup = "popup",
}

export enum MessageAction {
  JiraStoreChanged = "JiraStoreChanged",
  SettingStoreChanged = "SettingStoreChanged",
  JiraViewing = "JiraViewing",
}

interface BaseEvent {
  action: MessageAction;
  source: MessageSource;
}

interface JiraStoreChangedEvent extends BaseEvent {
  action: MessageAction.JiraStoreChanged;
  state: IJiraData;
}

interface SettingStoreChangedEvent extends BaseEvent {
  action: MessageAction.SettingStoreChanged;
  state: ISettingData;
}

interface JiraViewingEvent extends BaseEvent {
  action: MessageAction.JiraViewing;
  isOpen: boolean;
}

export type RuntimeMessageEvent =
  | JiraStoreChangedEvent
  | SettingStoreChangedEvent
  | JiraViewingEvent;

export async function sendMessage(message: RuntimeMessageEvent) {
  try {
    return await browser.runtime.sendMessage(message);
  } catch (error) {
    console.warn("Error sending message:", message);
  }
}

export function addMessageListener(callback: (message: RuntimeMessageEvent) => void) {
  browser.runtime.onMessage.addListener(callback);
}

export function isBackgroundScript() {
  return browser.extension && browser.extension.getBackgroundPage() === window;
}
