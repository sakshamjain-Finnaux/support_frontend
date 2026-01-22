import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import SelectField from "../../../components/form_elements/SelectField";
import DateField from "../../../components/form_elements/date_field/DateField";
import { TextAreaField } from "../../../components/form_elements/FormFields";
import Button from "../../../components/ui/button/Button";
import useUI from "../../../contexts/UIContext";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import useGetSubOrdinates from "../../../hooks/useGetSubOrdinates";

export default function AssignForm({ networkRequest, issueId, show }) {
  const { closeOverlay, toast } = useUI();

  const queryClient = useQueryClient();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const subOrdinates = useGetSubOrdinates(networkRequest);
  const designationValue = useWatch({
    control,
    name: "designation",
  });
  const subOrdinatesOptions = useMemo(() => {
    if (!subOrdinates.data) return [];

    return subOrdinates.data
      .filter(
        (subOrdinate) =>
          (subOrdinate.designation || "").toLowerCase() ===
          designationValue?.toLowerCase(),
      )
      .map((subOrdinate) => ({
        ...subOrdinate,
        label: subOrdinate.first_name + " " + subOrdinate.last_name,
        value: subOrdinate.emp_id,
      }));
  }, [subOrdinates.data, designationValue]);

  console.log("Selected Designation:", designationValue);

  const designationOption = useMemo(() => {
    if (!subOrdinates?.data) return [];

    const uniqueDesignations = new Set();

    subOrdinates.data.forEach((item) => {
      if (item.designation) {
        uniqueDesignations.add(item.designation.toLowerCase());
      }
    });
    console.log(uniqueDesignations);

    return Array.from(uniqueDesignations).map((designation) => ({
      label: designation,
      value: designation,
    }));
  }, [subOrdinates?.data]);

  const assignMutation = useMutation({
    mutationFn: assignIssue,
    onError: (error) => {
      if (!error.authenticated) return;
      toast.error(error.message);
    },
    onSuccess: (data) => {
      closeOverlay();
      toast.success("Issue was assigned successfully!");
      queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  async function assignIssue(data) {
    data["issue_id"] = parseInt(issueId);
    const result = await networkRequest("assign_issue", data);
    if (!result.success) throw result;
    return result;
  }

  return (
    // <div className='w-full mx-auto text-text p-6 shadow-md rounded-xl'>
    <form
      onSubmit={handleSubmit(assignMutation.mutate)}
      className="w-full flex flex-col gap-6">
      <SelectField
        disabled={subOrdinates.isLoading}
        isLoading={subOrdinates.isLoading}
        control={control}
        name={"designation"}
        options={designationOption}
        title={"Designation"}
        placeholder={subOrdinates.isLoading ? "Loading..." : "Select..."}
        rules={{
          required: "Select Designation!",
        }}
        formatOptionLabel={(option) => (
          <span className="">
            <div className="capitalize"> {option.label}</div>
            <div className="text-xs mt-1">{option.designation}</div>
          </span>
        )}
      />

      <SelectField
        disabled={!designationValue}
        isLoading={subOrdinates.isLoading}
        control={control}
        name={"assign_to"}
        options={subOrdinatesOptions}
        title={"Assign To"}
        placeholder={subOrdinates.isLoading ? "Loading..." : "Select..."}
        rules={{
          required: "Select Person!",
        }}
        formatOptionLabel={(option) => (
          <span className="">
            <div className="capitalize"> {option.label}</div>
            <div className="text-xs mt-1">{option.designation}</div>
          </span>
        )}
      />

      {show.priority && (
        <SelectField
          control={control}
          name={"priority"}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
          title={"Priority"}
          placeholder="Select Priority of Task"
          rules={{
            required: "Select priority!",
          }}
        />
      )}

      {show.target_date && (
        <DateField
          minDate={new Date()}
          control={control}
          name={"target_date"}
          title={"Target Date"}
          rules={{
            required: "Select target date!",
          }}
        />
      )}

      <TextAreaField
        errors={errors}
        name={"msg"}
        placeholder={"Remarks..."}
        register={register}
        title={"Remarks"}
        validationSchema={{
          required: "Remark is required!",
          maxLength: {
            value: 251,
            message: "Max Length is 251!",
          },
        }}
      />

      <div className="flex gap-4 ml-auto">
        <Button variant="red" onClick={closeOverlay}>
          Cancel
        </Button>

        <Button
          disabled={assignMutation.isLoading || assignMutation.isSuccess}
          variant="primary"
          type="submit"
          className="disabled:animate-pulse">
          Assign Issue
        </Button>
      </div>
    </form>
    // </div>
  );
}
