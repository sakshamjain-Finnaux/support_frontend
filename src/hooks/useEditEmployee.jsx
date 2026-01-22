import useUI from "../contexts/UIContext";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import utilities from "../utilities";
import url from "../network/url";

//get the data of the employee of given id
export function useGetEditEmployeeData(networkRequest, emp_id) {

    async function fetchData() {
        const result = await networkRequest("get_edit_employee", emp_id);
        if (!result.success) throw result;

        if (result.data.supervisor) {
            //for react_select;
            let supervisor = result.data.supervisor;
            result.data.supervisor = supervisor.emp_id;
        }

        if (result.data.subordinates) {
            //for react select
            result.data.selectedSubordinates = result.data.subordinates;
            result.data.subordinates = result.data.subordinates.map(subordinate => subordinate.emp_id);

        }
        if (result.data.media?.length) {
            result.data.media[0] = await utilities.getFileFromUrl(url + "/" + result.data.media[0], "profile");
        }
        return result.data;
    }

    const query = useQuery({
        queryKey: ["employees", String(emp_id), "edit"],
        queryFn: fetchData
    })

    return query;
}

//post the data of the employee of given id
export function usePostEditEmployeeData(networkRequest, emp_id) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast, closeOverlay } = useUI();

    const editMutation = useMutation({
        mutationFn: editEmployee,
        onError: (error, variables, context) => {
            if (!error.authenticated) return;
            toast.error(error.message);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["employees"]);
            toast.success("Employee details were edited successfully!");
            navigate(-1, { replace: true });
            closeOverlay();
        },
    })

    async function editEmployee(data) {
        let fields = Object.keys(data);
        for (let field of fields) {
            if (typeof data[field] === "number") {
                data[field] += "";
            }
        }
        if (data["media"]) {
            const temp = [];
            for (let image of data["media"]) {
                let base64 = await utilities.convertToBase64(image);
                temp.push(base64);
            }
            data["media"] = temp;
        }
        if (data["role"] === "subadmin") {
            delete data["supervisor"];
            if (!data["subordinates"]) data["subordinates"] = [];
        }
        else {
            delete data["subordinates"];
            if (!data["supervisor"]) data["supervisor"] = null;
        }
        data.id = emp_id;
        const result = await networkRequest("post_edit_employee", data);
        if (!result.success) throw result;
        return result;
    }

    return editMutation;
}