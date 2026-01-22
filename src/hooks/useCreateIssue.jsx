import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import useUI from "../contexts/UIContext";
import utilities from "../utilities";
export default function useCreateIssue(networkRequest) {
    const { toast, closeOverlay } = useUI();
    const queryClient = useQueryClient();
    const addMutation = useMutation({
        mutationFn: addIssue,
        onError: (error, variables, context) => {
            if (!error.authenticated) return;
            toast.error(error.message);
        },
        onSuccess: (data, variables, context) => {
            toast.success("New Issue was created successfully!");
            closeOverlay();
            queryClient.invalidateQueries(["issues"]);
            queryClient.invalidateQueries(["tasks"]);

        },
    })

    async function addIssue(data) {
        if (data.url === undefined || data.type === "app") data.url = '';
        if (data["media"]) {
            data["media"] = await utilities.convertImagesToBase64(data["media"]);
        }
        const result = await networkRequest("create_issue", data);
        if (!result.success) throw result;
        return result;
    }

    return addMutation;
}