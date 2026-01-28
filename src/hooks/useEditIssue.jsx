import useUI from "../contexts/UIContext";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import utilities from "../utilities";
import url from "../network/url";

//get the data of the issue of given id
export function useGetEditIssueData(networkRequest, issueId) {
  async function fetchData() {
    const result = await networkRequest("get_edit_issue", issueId);
    if (!result.success) throw result;
    result.data["oldMedia"] = Array.isArray(result.data["media"])
      ? [...result.data["media"]].map((imageLink) => url + "/" + imageLink)
      : [];
    delete result.data["media"];
    return result.data;
  }

  const query = useQuery({
    queryKey: ["issues", String(issueId), "edit"],
    queryFn: fetchData,
  });

  return query;
}

//post the data of the issue of given id
export function usePostEditIssueData(networkRequest, issueId) {
  const queryClient = useQueryClient();
  const { toast, closeOverlay } = useUI();

  const editMutation = useMutation({
    mutationFn: editIssue,
    onError: (error, variables, context) => {
      if (!error.authenticated) return;
      toast.error(error.message);
    },
    onSuccess: (data, variables, context) => {
      toast.success("Issue was edited successfully!");
      closeOverlay();
      queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  async function editIssue(data) {
    data.id = issueId;
    if (data.url === undefined || data.type === "app") data.url = "";

    if (!data["media"]) data["media"] = [];
    data["media"] = await utilities.convertImagesToBase64(data["media"]);
    if (data["oldMedia"]) {
      data["oldMedia"] = await utilities.convertImageUrlsToBase64(
        data["oldMedia"],
      );
      data["oldMedia"].push(...data["media"]);
      data["media"] = [...data["oldMedia"]];
    }
    delete data["oldMedia"];
    const result = await networkRequest("post_edit_issue", data);
    if (!result.success) throw result;
    return result;
  }

  return editMutation;
}
