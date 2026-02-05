import TimeLine from "../../../components/timeline/Timeline";
import { useForm } from "react-hook-form";
import SelectField from "../../../components/form_elements/SelectField";
import { TextAreaField } from "../../../components/form_elements/FormFields";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../../components/ui/spinner/Spinner";
import { InputField } from "../../../components/form_elements/FormFields";
import url from "../../../network/url";

export default function IssueTimeLineView({
  networkRequest,
  issueId,
  children,
}) {
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

  return (
    <div className="max-w-full p-3 w-[40rem] space-y-8 bg-body-940 md:p-8 rounded-lg">
      <IssueView formData={query.data?.issue_details} />
      <TimeLine timeline={query.data?.transactions} />
      {children}
    </div>
  );
}

function IssueView({ formData }) {
  const {
    register,
    watch,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...formData,
    },
  });

  const watchType = watch("issue_type");

  return (
    <form onSubmit={handleSubmit(null)} className="w-full flex flex-col gap-6">
      {formData?.tat && (
        <span className="text-medium text-body-400">
          {"TAT: " + formData?.tat}
        </span>
      )}
      <InputField
        disabled={true}
        errors={errors}
        name={"title"}
        placeholder={"Issue Title"}
        title={"Title"}
        register={register}
        validationSchema={{
          required: "Title is required",
        }}
        type="text"
      />

      <SelectField
        disabled={true}
        control={control}
        name={"issue_type"}
        options={[
          { value: "web", label: "Web" },
          { value: "app", label: "App" },
        ]}
        title={"Type"}
        placeholder="Select..."
        rules={{
          required: "Select Issue Type!",
        }}
      />

      {watchType === "web" && (
        <InputField
          disabled={true}
          errors={errors}
          name={"url"}
          placeholder={"URL of Page"}
          title={"Mention URL"}
          register={register}
          type="text"
        />
      )}

      <TextAreaField
        disabled={true}
        errors={errors}
        name={"description"}
        placeholder={"Describe the issue"}
        register={register}
        title={"Description"}
        validationSchema={{
          required: "Description is required!",
          maxLength: {
            value: 251,
            message: "Max Length is 251!",
          },
        }}
      />

      {formData["media"] && (
        <div>
          <div className="mb-1">Screen Proof</div>
          <div className="flex flex-col gap-4">
            {formData["media"].map((imageLink) => (
              <a
                className="flex justify-between py-2 px-3 bg-body-800 items-center rounded-lg hover:underline underline-offset-4"
                key={imageLink}
                href={url + "/" + imageLink}
                target="_blank">
                {imageLink.substring(imageLink.lastIndexOf("/") + 1)}
              </a>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
