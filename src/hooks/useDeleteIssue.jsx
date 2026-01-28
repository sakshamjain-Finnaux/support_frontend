import { useMutation } from "@tanstack/react-query";
import useUI from "../contexts/UIContext";
import { useQueryClient } from "@tanstack/react-query";

export default function useDeleteIssue(networkRequest) {
  const { toast, setShowFullSpinner } = useUI();

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteIssue,
    onMutate: () => setShowFullSpinner(true),
    onError: (error, variables, context) => {
      if (!error.authenticated) return;
      toast.error(error.message);
    },
    onSuccess: (data, variables, context) => {
      toast.warning("Issue was deleted successfully!");
      queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["tasks"]);
    },
    onSettled: () => setShowFullSpinner(false),
  });

  async function deleteIssue(issue_id) {
    const result = await networkRequest("delete_issue", issue_id);
    if (!result.success) throw result;
    return result;
  }

  return deleteMutation;
}
