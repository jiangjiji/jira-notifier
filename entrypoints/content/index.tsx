import { useSettingStore } from "@/src/store/settingStore";
import {
  MessageAction,
  MessageSource,
  sendMessage,
} from "@/src/utils/common/messageType";
import ReactDOM from "react-dom/client";
import ContentToast from "./content-toast";

export default defineContentScript({
  matches: ["<all_urls>"],
  main(ctx) {
    const url = useSettingStore.getState().serverURL;
    if (!window.location.href.includes(url)) return;

    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",
      onMount: (container) => {
        sendMessage({
          action: MessageAction.JiraViewing,
          source: MessageSource.ContentScript,
          isOpen: true,
        });

        const root = ReactDOM.createRoot(container);
        root.render(<ContentToast />);
        return root;
      },
      onRemove: (root) => {
        sendMessage({
          action: MessageAction.JiraViewing,
          source: MessageSource.ContentScript,
          isOpen: true,
        });

        root?.unmount();
      },
    });

    ui.mount();
  },
});
