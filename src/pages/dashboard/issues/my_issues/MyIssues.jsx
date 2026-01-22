import IssuesPage from "../IssuesPage";
import MyPendingIssues from "./MyPendingIssues";
import MyInProgressIssues from "./MyInProgressIssues";
import MyResolvedIssues from "./MyResolvedIssues";
export default function MyIssues() {
    const tabs = [
        {
            name: "Pending",
            children: <MyPendingIssues />,
            isVisible: true,
        },
        {
            name: "In Progress",
            children: <MyInProgressIssues />,
            isVisible: true,
        },
        {
            name: "Resolved",
            children: <MyResolvedIssues />,
            isVisible: true,
        },
    ]
    return (
        <IssuesPage
            name={"My Issues"}
            tabs={tabs}
        />
    )
}