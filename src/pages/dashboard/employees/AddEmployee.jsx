
import { useData } from "../../../contexts/DataContext";
import useAddEmployee from "../../../hooks/useAddEmployee";
import EmployeeForm from "./EmployeeForm";

export default function AddEmployee() {
    const { networkRequest } = useData();

    const submitMutation = useAddEmployee(networkRequest);
    return (
        <div className="flex-grow gap-6 flex flex-col">
            <h1 className="text-3xl font-medium text-primary-500 ">Add Employee</h1>
            <EmployeeForm
                submitMutation={submitMutation}
                type="add"
            />
        </div >
    )
}

