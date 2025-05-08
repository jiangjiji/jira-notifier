import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  showToast(data: { title: string; description: string }): void;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
