import IssuesPage from "../IssuesPage";
import PERMISSIONS from "../../../../permissions";
import useAuth from "../../../../contexts/AuthContext";
import ClientsPendingIssues from "./ClientsPendingIssues";
import ClientsInProgressIssues from "./ClientsInProgressIssues";
import ClientsAssignedIssues from "./ClientsAssignedIssues";
import ClientsRevertedIssues from "./ClientsRevertedIssues";
import ClientsResolvedIssues from "./ClientsResolvedIssues";

export default function ClientsIssues() {
    const { hasPermission } = useAuth();
    const tabs = [
        {
            name: "Pending",
            children: <ClientsPendingIssues />,
            isVisible: true,
        },
        {
            name: "In Progress",
            children: <ClientsInProgressIssues />,
            isVisible: true
        },
        {
            name: "Assigned",
            children: <ClientsAssignedIssues />,
            isVisible: hasPermission(PERMISSIONS.can_assign),
        },
        {
            name: "Reverted",
            children: <ClientsRevertedIssues />,
            isVisible: hasPermission(PERMISSIONS.can_assign),
        },
        {
            name: "Resolved",
            children: <ClientsResolvedIssues />,
            isVisible: true
        },
    ]
    return (
        <IssuesPage
            tabs={tabs}
            name={"Clients Issues"}
        />
    )
}