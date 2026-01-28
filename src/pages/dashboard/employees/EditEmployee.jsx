import { useData } from "../../../contexts/DataContext";
import EmployeeForm from "./EmployeeForm";
import { useParams } from "react-router-dom";
import {
  usePostEditEmployeeData,
  useGetEditEmployeeData,
} from "../../../hooks/useEditEmployee";
import Spinner from "../../../components/ui/spinner/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUI from "../../../contexts/UIContext";
import { useForm } from "react-hook-form";
import { InputField } from "../../../components/form_elements/FormFields";
import Button from "../../../components/ui/button/Button";
import utilities from "../../../utilities";
import { useNavigate } from "react-router-dom";

export default function EditEmployee() {
  const { emp_id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { networkRequest } = useData();
  const { showConfirmDialog, setShowFullSpinner, showInOverlay, toast } =
    useUI();

  const query = useGetEditEmployeeData(networkRequest, emp_id);

  const submitMutation = usePostEditEmployeeData(networkRequest, emp_id);

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      setShowFullSpinner(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      showInOverlay(<ShowNewPassword formData={data} />);
    },

    onSettled: () => {
      setShowFullSpinner(false);
    },
  });

  async function resetPassword() {
    const result = await networkRequest("reset_employee_password", emp_id);
    if (!result.success) throw result;
    return result.data;
  }

  const inactiveMutation = useMutation({
    mutationFn: makeEmployeeInactive,
    onMutate: () => {
      setShowFullSpinner(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["employees"]);
      navigate(-1, { replace: true });
      toast.warning("Made employee Inactive!");
    },

    onSettled: () => {
      setShowFullSpinner(false);
    },
  });

  async function makeEmployeeInactive() {
    const result = await networkRequest("make_employee_inactive", emp_id);
    if (!result.success) throw result;
    return result.data;
  }

  if (query.isLoading) return <Spinner />;

  if (query.isError) {
    return (
      <div className="flex flex-grow items-center justify-center flex-col">
        <p className="font-medium text-2xl text-body-500">
          Invalid Employee Id!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow gap-6 flex flex-col">
      <h1 className="text-3xl font-medium text-primary-500">Edit Employee</h1>
      <EmployeeForm
        formData={query.data}
        submitMutation={submitMutation}
        resetPassword={() =>
          showConfirmDialog("Reset Password!", resetPasswordMutation.mutate)
        }
        inactiveCallback={() =>
          showConfirmDialog("Make Employee Inactive!", inactiveMutation.mutate)
        }
        type="edit"
      />
    </div>
  );
}

function ShowNewPassword({ formData }) {
  const { toast } = useUI();

  const {
    register,
    formState: { errors },
  } = formData
    ? useForm({
        defaultValues: {
          ...formData,
        },
      })
    : useForm();

  function onCopy() {
    utilities.copyToClipboard(
      `Username: ${formData.username}
Password: ${formData.password}
`,
    );
    toast.info("Copied to Clipboard!");
  }
  return (
    <div>
      <form className="p-4 flex flex-col gap-6 bg-zinc-900 border-2 border-zinc-800 rounded-lg">
        <InputField
          register={register}
          errors={errors}
          title={"New Password"}
          placeholder={"New Password"}
          disabled={true}
          name={"password"}
        />

        <Button onClick={onCopy} type="button">
          Copy to clipboard
        </Button>
      </form>
    </div>
  );
}
