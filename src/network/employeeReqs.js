import URL from "./url";
import makeRequest from "./makeRequest";
const employeeReqs = {};
import { generatePaginatedURL } from "./networkUtils";

employeeReqs.addEmployee = async (obj) => {
  const result = await employeeRequest("POST", "employees", obj);
  return result;
};

employeeReqs.makeEmployeeIactive = async (emp_id) => {
  const result = await employeeRequest("DELETE", "employees/" + emp_id);
  return result;
};

employeeReqs.getEmployees = async (pageData) => {
  const url = generatePaginatedURL("employees", pageData);
  const result = await employeeRequest("GET", url);
  return result;
};

employeeReqs.getEmployeeUpdateData = async (id) => {
  const result = await employeeRequest("GET", "employees/" + id);
  return result;
};

employeeReqs.postEmployeeUpdateData = async (obj) => {
  const id = obj.id;
  delete obj.id;
  const result = await employeeRequest("POST", "employees/" + id, obj);
  return result;
};

employeeReqs.getSupervisors = async () => {
  const result = await employeeRequest("GET", "supervisors");
  return result;
};

employeeReqs.getSubordinates = async () => {
  const result = await employeeRequest("GET", "subordinates");
  return result;
};

employeeReqs.resetEmployeePassword = async (emp_id) => {
  const result = await employeeRequest("GET", "reset_password/" + emp_id);
  return result;
};

async function employeeRequest(method, endpoint, body = {}) {
  const url = `${URL}/${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
  };
  const result = await makeRequest(method, url, headers, body);
  return result;
}

export default employeeReqs;
