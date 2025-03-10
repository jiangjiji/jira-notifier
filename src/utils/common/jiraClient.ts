import { Version2Client } from "jira.js";

const clientOptions = {
  host: "http://192.168.1.230:8080",
};

export const jiraClient = new Version2Client(clientOptions);

jiraClient.handleFailedResponse = (response) => {
  console.log("handleFailedResponse", response);
};
