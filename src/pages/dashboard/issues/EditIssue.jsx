import Spinner from "../../../components/ui/spinner/Spinner";
import {
  useGetEditIssueData,
  usePostEditIssueData,
} from "../../../hooks/useEditIssue";
import IssueForm from "./IssueForm";
export default function EditIssue({ networkRequest, issueId }) {
  const query = useGetEditIssueData(networkRequest, issueId);

  const editMutation = usePostEditIssueData(networkRequest, issueId);

  if (query.isLoading) return <Spinner />;

  if (query.isError) {
    return (
      <div className="flex flex-grow items-center justify-center flex-col">
        <p className="font-medium text-4xl">No such issue exists!</p>
      </div>
    );
  }

  if (query.data) {
    return (
      <div className="w-[30rem]">
        <IssueForm
          submitMutation={editMutation}
          formData={query.data}
          formType={"edit"}
        />
      </div>
    );
  }
}
