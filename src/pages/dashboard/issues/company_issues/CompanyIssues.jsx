import IssuesPage from "../IssuesPage";
import PERMISSIONS from "../../../../permissions";
import useAuth from "../../../../contexts/AuthContext";
import CompanyPendingIssues from "./CompanyPendingIssues";
import CompanyInProgressIssues from "./CompanyInProgressIssues";
import CompanyAssignedIssues from "./CompanyAssignedIssues";
import CompanyRevertedIssues from "./CompanyRevertedIssues";
import CompanyResolvedIssues from "./CompanyResolvedIssues";

export default function CompanyIssues() {
  const { hasPermission } = useAuth();
  const tabs = [
    {
      name: "Pending",
      children: <CompanyPendingIssues />,
      isVisible: true,
    },
    {
      name: "In Progress",
      children: <CompanyInProgressIssues />,
      isVisible: true,
    },
    {
      name: "Assigned",
      children: <CompanyAssignedIssues />,
      isVisible: hasPermission(PERMISSIONS.can_assign),
    },
    {
      name: "Reverted",
      children: <CompanyRevertedIssues />,
      isVisible: hasPermission(PERMISSIONS.can_assign),
    },
    {
      name: "Resolved",
      children: <CompanyResolvedIssues />,
      isVisible: true,
    },
  ];
  return <IssuesPage tabs={tabs} name={"Company Issues"} />;
}
