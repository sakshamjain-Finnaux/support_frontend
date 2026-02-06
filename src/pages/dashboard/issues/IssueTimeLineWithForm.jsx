import AssignForm from "./AssignForm";
import IssueTimeLineView from "./IssueTimeLineView";
import { useMutation, useQuery } from "@tanstack/react-query";
import Spinner from "../../../components/ui/spinner/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useUI from "../../../contexts/UIContext";
import SelectField from "../../../components/form_elements/SelectField";
import { TextAreaField } from "../../../components/form_elements/FormFields";
import Button from "../../../components/ui/button/Button";
import { useMemo } from "react";
import PERMISSIONS from "../../../permissions";
import useAuth from "../../../contexts/AuthContext";
export default function IssueTimeLineWithForm({ networkRequest, issueId }) {
  const assignFieldsQuery = useQuery({
    queryFn: getFields,
    queryKey: ["issues", String(issueId), "assign"],
    staleTime: 0,
  });

  const issueQuery = useQuery({
    queryKey: ["issues", String(issueId)],
    queryFn: async () => {
      const result = await networkRequest("get_issue", issueId);
      if (!result.success) throw result;
      return result.data;
    },
    staleTime: 0,
  });

  async function getFields() {
    const result = await networkRequest("get_assign_fields", issueId);
    if (!result.success) throw result;
    return result.data;
  }

  if (assignFieldsQuery.isLoading || issueQuery.isLoading) return <Spinner />;

  if (assignFieldsQuery.isError || issueQuery.isError) {
    return (
      <div>
        <p className="text-body-400 text-center  text-xl">There was an error</p>
      </div>
    );
  }

  return (
    <IssueTimeLineView issueId={issueId} networkRequest={networkRequest}>
      {(assignFieldsQuery.data?.assign ||
        assignFieldsQuery.data?.revert ||
        assignFieldsQuery.data?.resolve) && (
        <RemarkForm
          issueId={issueId}
          networkRequest={networkRequest}
          fields={assignFieldsQuery.data}
          transactions={issueQuery.data?.transactions || []}
        />
      )}
    </IssueTimeLineView>
  );
}

function RemarkForm({ networkRequest, issueId, fields, transactions }) {
  const { hasPermission, user } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    control,
  } = useForm();

  const watchStatus = watch("status");

  // Check if current user has already completed their part
  const hasUserCompleted = useMemo(() => {
    if (!user || !transactions) return false;

    // Find the assignment transaction for this user
    const userAssignment = transactions.find(
      (t) =>
        t.type === "Assigned" &&
        t.assignees &&
        t.assignees.some(
          (a) => a.emp_id === user.emp_id && a.status === "completed",
        ),
    );

    return !!userAssignment;
  }, [user, transactions]);

  const statusOptions = useMemo(() => {
    const revert_options = [
      {
        label: "Complete",
        value: "complete",
      },
      {
        label: "Revert",
        value: "revert",
      },
      {
        label: "Assign",
        value: "assign",
      },
    ];

    const resolve_options = [
      {
        label: "Resolve",
        value: "resolve",
      },
      {
        label: "Assign",
        value: "assign",
      },
    ];

    let options = fields.resolve ? resolve_options : revert_options;

    if (!hasPermission(PERMISSIONS.can_assign)) {
      options = options.filter((option) => option.value !== "assign");
    }

    // If user has already completed, remove complete/revert options
    if (hasUserCompleted) {
      options = options.filter(
        (option) => option.value !== "complete" && option.value !== "revert",
      );
    }

    return options;
  }, [fields, hasUserCompleted, hasPermission]);

  const { closeOverlay, toast } = useUI();

  const revertMutation = useMutation({
    mutationFn: revertIssue,
    onError: (error) => {
      if (!error.authenticated) return;
      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (String(data?.message || "").includes("Waiting for other assignees")) {
        toast.success(data.message);
        queryClient.invalidateQueries(["issues"]);
        queryClient.invalidateQueries(["tasks"]);
        return;
      }

      closeOverlay();
      let text = "Operation successful!";
      if (watchStatus === "complete") text = "Task marked completed!";
      else if (watchStatus === "revert") text = "Task reverted successfully!";
      else if (watchStatus === "resolve") text = "Issue resolved successfully!";
      toast.success(text);
      queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  async function revertIssue(data) {
    data["issue_id"] = parseInt(issueId);
    data["assign_to"] = -1;
    data["completed"] = data["status"] === "complete" ? true : false;
    delete data["status"];
    const result = await networkRequest("assign_issue", data);
    if (!result.success) throw result;
    return result;
  }

  return (
    <>
      {hasUserCompleted ? (
        <div className="w-full p-4 bg-body-940 rounded-lg text-center">
          <p className="text-body-400 text-sm">
            You have already completed your part of this task.
          </p>
        </div>
      ) : (
        <form
          onSubmit={
            watchStatus === "assign"
              ? null
              : handleSubmit(revertMutation.mutate)
          }
          className="w-full flex flex-col gap-6">
          <SelectField
            defaultValue={fields.resolve ? "resolve" : "complete"}
            control={control}
            name={"status"}
            title={"Status"}
            placeholder="Status"
            rules={{
              required: "Select status!",
            }}
            options={statusOptions}
          />

          {watchStatus !== "assign" && (
            <>
              <TextAreaField
                errors={errors}
                name={"msg"}
                placeholder={"Remarks..."}
                register={register}
                title={"Remarks*"}
                validationSchema={{
                  required: "Remark is required!",
                  maxLength: {
                    value: 251,
                    message: "Max Length is 251!",
                  },
                }}
              />

              <div className="flex gap-4 ml-auto">
                {fields.resolve ? (
                  <Button
                    disabled={
                      revertMutation.isLoading || revertMutation.isSuccess
                    }
                    type="submit"
                    className="disabled:animate-pulse"
                    variant="dark">
                    Resolve
                  </Button>
                ) : (
                  <>
                    <Button
                      disabled={
                        revertMutation.isLoading || revertMutation.isSuccess
                      }
                      variant="blue"
                      type="submit"
                      className="disabled:animate-pulse">
                      Send
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </form>
      )}

      {watchStatus === "assign" && (
        <AssignForm
          networkRequest={networkRequest}
          issueId={issueId}
          show={fields}
        />
      )}
    </>
  );
}
