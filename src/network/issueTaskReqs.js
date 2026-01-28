import URL from "./url";
import makeRequest from "./makeRequest";
const issueTaskReqs = {};
import { generatePaginatedURL } from "./networkUtils";

issueTaskReqs.createIssue = async (obj) => {
  const result = await issueTaskRequest("POST", "issues", obj);
  return result;
};

issueTaskReqs.deleteIssue = async (id) => {
  const result = await issueTaskRequest("DELETE", "issues/" + id);
  return result;
};

issueTaskReqs.getIssueUpdateData = async (id) => {
  const result = await issueTaskRequest("GET", "issues/edit/" + id);
  return result;
};

issueTaskReqs.postIssueUpdateData = async (obj) => {
  const id = obj.id;
  delete obj.id;
  const result = await issueTaskRequest("POST", "issues/edit/" + id, obj);
  return result;
};

issueTaskReqs.getIssue = async (id) => {
  const result = await issueTaskRequest("GET", "issues/" + id);
  return result;
};

issueTaskReqs.assignIssue = async (obj) => {
  const result = await issueTaskRequest("POST", "forward", obj);
  return result;
};

issueTaskReqs.getAssignFields = async (id) => {
  const result = await issueTaskRequest("GET", "forward/" + id);
  return result;
};

//user issues
issueTaskReqs.getUserPendingIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/user/pending", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getUserInProgressIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/user/in_progress", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getUserResolvedIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/user/resolved", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getUserAssignedTasks = async (pageData) => {
  const url = generatePaginatedURL("tasks/user/assigned", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getUserPendingTasks = async (pageData) => {
  const url = generatePaginatedURL("tasks/user/pending", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getUserRevertedTasks = async (pageData) => {
  const url = generatePaginatedURL("tasks/user/reverted", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

//clients issues
issueTaskReqs.getClientsPendingIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/clients/pending", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getClientsInProgressIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/clients/in_progress", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getClientsAssignedIssues = async (pageData) => {
  const url = generatePaginatedURL("tasks/clients/assigned", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};
issueTaskReqs.getClientsRevertedIssues = async (pageData) => {
  const url = generatePaginatedURL("tasks/clients/reverted", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getClientsResolvedIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/clients/resolved", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

//finnaux issues
issueTaskReqs.getFinnauxPendingIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/finnaux/pending", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getFinnauxInProgressIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/finnaux/in_progress", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getFinnauxAssignedIssues = async (pageData) => {
  const url = generatePaginatedURL("tasks/finnaux/assigned", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getFinnauxRevertedIssues = async (pageData) => {
  const url = generatePaginatedURL("tasks/finnaux/reverted", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.getFinnauxResolvedIssues = async (pageData) => {
  const url = generatePaginatedURL("issues/finnaux/resolved", pageData);
  const result = await issueTaskRequest("GET", url);
  return result;
};

issueTaskReqs.canUpdate = async (id) => {
  const result = await issueTaskRequest("GET", "validate/" + id);
  return result;
};

async function issueTaskRequest(method, endpoint, body = {}) {
  const url = `${URL}/${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
  };
  const result = await makeRequest(method, url, headers, body);
  return result;
}

export default issueTaskReqs;
