import { createContext, useContext } from "react";
import issueTaskReqs from "../network/issueTaskReqs";
import employeeReqs from "../network/employeeReqs";
import miscReqs from "../network/miscReqs";
import userReqs from "../network/userReqs";
import { useQueryClient } from "@tanstack/react-query";
import useUI from "./UIContext";
import useAuth from "./AuthContext";

const DataContext = createContext();

export function DataProivder({ children }) {
  const queryClient = useQueryClient();
  const { setShowFullSpinner, closeOverlay, toast } = useUI();
  const { invalidateUser } = useAuth();

  async function networkRequest(type, payload) {
    let result = null;
    switch (type) {
      //issues
      case "create_issue":
        result = await issueTaskReqs.createIssue(payload);
        break;
      case "get_issue":
        result = await issueTaskReqs.getIssue(payload);
        break;
      case "get_edit_issue":
        result = await issueTaskReqs.getIssueUpdateData(payload);
        // result = await issueTaskReqs.getIssue(payload);
        break;
      case "post_edit_issue":
        result = await issueTaskReqs.postIssueUpdateData(payload);
        break;
      case "delete_issue":
        result = await issueTaskReqs.deleteIssue(payload);
        break;
      case "assign_issue":
        result = await issueTaskReqs.assignIssue(payload);
        break;
      case "get_assign_fields":
        result = await issueTaskReqs.getAssignFields(payload);
        break;

      //user issues and tasks
      case "user_pending_issues":
        result = await issueTaskReqs.getUserPendingIssues(payload);
        break;
      case "user_inprogress_issues":
        result = await issueTaskReqs.getUserInProgressIssues(payload);
        break;
      case "user_resolved_issues":
        result = await issueTaskReqs.getUserResolvedIssues(payload);
        break;
      case "user_pending_tasks":
        result = await issueTaskReqs.getUserPendingTasks(payload);
        break;
      case "user_assigned_tasks":
        result = await issueTaskReqs.getUserAssignedTasks(payload);
        break;
      case "user_reverted_tasks":
        result = await issueTaskReqs.getUserRevertedTasks(payload);
        break;

      //finnaux issues
      case "finnaux_pending_issues":
        result = await issueTaskReqs.getFinnauxPendingIssues(payload);
        break;
      case "finnaux_inprogress_issues":
        result = await issueTaskReqs.getFinnauxInProgressIssues(payload);
        break;
      case "finnaux_assigned_issues":
        result = await issueTaskReqs.getFinnauxAssignedIssues(payload);
        break;
      case "finnaux_reverted_issues":
        result = await issueTaskReqs.getFinnauxRevertedIssues(payload);
        break;
      case "finnaux_resolved_issues":
        result = await issueTaskReqs.getFinnauxResolvedIssues(payload);
        break;

      //client issues
      case "clients_pending_issues":
        result = await issueTaskReqs.getClientsPendingIssues(payload);
        break;
      case "clients_inprogress_issues":
        result = await issueTaskReqs.getClientsInProgressIssues(payload);
        break;
      case "clients_assigned_issues":
        result = await issueTaskReqs.getClientsAssignedIssues(payload);
        break;
      case "clients_reverted_issues":
        result = await issueTaskReqs.getClientsRevertedIssues(payload);
        break;
      case "clients_resolved_issues":
        result = await issueTaskReqs.getClientsResolvedIssues(payload);
        break;

      //employees
      case "add_employee":
        result = await employeeReqs.addEmployee(payload);
        break;
      case "get_employees":
        result = await employeeReqs.getEmployees(payload);
        break;
      case "get_edit_employee":
        result = await employeeReqs.getEmployeeUpdateData(payload);
        break;
      case "post_edit_employee":
        result = await employeeReqs.postEmployeeUpdateData(payload);
        break;
      case "get_supervisors":
        result = await employeeReqs.getSupervisors();
        break;
      case "get_subordinates":
        result = await employeeReqs.getSubordinates();
        break;
      case "reset_employee_password":
        result = await employeeReqs.resetEmployeePassword(payload);
        break;

      case "make_employee_inactive":
        result = await employeeReqs.makeEmployeeIactive(payload);
        break;

      //user
      case "get_user_subordinates":
        result = await userReqs.getSubordinates();
        break;

      default:
        result = null;

      //misc
      case "get_indian_states":
        result = await miscReqs.getIndianStates();
        break;
    }

    if (result === null) throw new Error("Unhandled error in network Request!");
    if (!result.authenticated) {
      queryClient.removeQueries();
      toast.error("Session expired!");
      closeOverlay();
      setShowFullSpinner(false);
      invalidateUser();
    }
    return result;
  }

  return (
    <DataContext.Provider value={{ networkRequest }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
