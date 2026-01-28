import useUI from "../contexts/UIContext";
import { useForm } from "react-hook-form";
import { InputField } from "../components/form_elements/FormFields";
import { useMutation } from "@tanstack/react-query";
import Button from "../components/ui/button/Button";
import utilities from "../utilities";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function useAddEmployee(networkRequest) {
  const { toast, showInOverlay } = useUI();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: onSubmit,
    onError: (error, variables, context) => {
      if (!error.authenticated) return;
      toast.error(error.message);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["employees"]);
      navigate(-1, { replace: true });
      toast.success("Employee was added successfully!");
      showInOverlay(<ShowUsernamePassword formData={data} />, false);
    },
  });

  async function onSubmit(data) {
    if (data["media"]) {
      data["media"] = await utilities.convertImagesToBase64(data["media"]);
    }

    if (data["role"] === "subadmin") {
      delete data["supervisor"];
      if (!data["subordinates"]) data["subordinates"] = [];
    } else {
      delete data["subordinates"];
      if (!data["supervisor"]) data["supervisor"] = null;
    }

    const result = await networkRequest("add_employee", data);
    if (!result.success) throw result;
    return result.data;
  }

  return addMutation;
}

function ShowUsernamePassword({ formData }) {
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
    let copyString =
      "Username: " +
      formData.username +
      "\n" +
      "Password: " +
      formData.password;
    utilities.copyToClipboard(copyString);
    toast.info("Copied to Clipboard!");
  }
  return (
    <div>
      <form className="p-4 flex flex-col gap-6 bg-zinc-900 border-2 border-zinc-800 rounded-lg">
        <InputField
          register={register}
          errors={errors}
          title={"Username"}
          placeholder={"Username"}
          disabled={true}
          name={"username"}
        />
        <InputField
          register={register}
          errors={errors}
          title={"Password"}
          placeholder={"Password"}
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
