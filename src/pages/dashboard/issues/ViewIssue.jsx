import { useQuery } from "@tanstack/react-query";
import Spinner from "../../../components/ui/spinner/Spinner";
import IssueForm from "./IssueForm";

export default function ViewIssue({ networkRequest, issueId }) {
  async function fetchData() {
    const result = await networkRequest("get_issue", issueId);
    if (!result.success) throw result;
    return result.data;
  }
  const query = useQuery({
    queryKey: ["issues", String(issueId)],
    queryFn: fetchData,
  });

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
      <div className="min-w-[30rem] w-full">
        <IssueForm formData={query.data} formType={"view"} />
      </div>
    );
  }
}
