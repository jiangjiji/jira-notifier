import { nodePolyfills } from "vite-plugin-node-polyfills";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [nodePolyfills({ protocolImports: true })],
  }),
  manifest: {
    permissions: ["notifications", "idle"],
    host_permissions: ["<all_urls>"],
  },
});
