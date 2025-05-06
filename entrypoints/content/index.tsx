import { useSettingStore } from "@/src/store/settingStore";
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
        const root = ReactDOM.createRoot(container);
        root.render(<ContentToast />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
