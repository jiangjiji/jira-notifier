import { Version2Client } from "jira.js";

async function test() {
  const clientOptions = {
    host: "http://192.168.1.230:8080",
  };

  const jira = new Version2Client(clientOptions);

  const userInfo = await jira.myself.getCurrentUser();

  console.log(userInfo);
  console.log(userInfo.displayName);
}

export default defineBackground(() => {
  test();
  console.log("Hello background!", { id: browser.runtime.id });
});
