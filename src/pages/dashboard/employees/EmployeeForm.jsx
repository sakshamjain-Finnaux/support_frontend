import { InputField } from "../../../components/form_elements/FormFields";
import { useForm, useWatch } from "react-hook-form";
import DateField from "../../../components/form_elements/date_field/DateField";
import SelectField from "../../../components/form_elements/SelectField";
import Button from "../../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { UncontrolledCheckBox } from "../../../components/form_elements/UnControlledFields";
import { useQuery } from "@tanstack/react-query";
import { useData } from "../../../contexts/DataContext";
import { useMemo } from "react";
import useGetIndianStates from "../../../hooks/useGetIndianStates";
import url from "../../../network/url";

export default function EmployeeForm({
  formData,
  submitMutation,
  type,
  resetPassword = null,
  inactiveCallback = null,
}) {
  const {
    register,
    setValue,
    control,
    unregister,
    formState: { errors },
    handleSubmit,
  } = formData
    ? useForm({
        defaultValues: {
          ...formData,
        },
      })
    : useForm();

  return (
    <form
      onSubmit={handleSubmit(submitMutation.mutate)}
      className="flex flex-wrap gap-4 bg-body-800 bg-opacity-40 p-4 rounded-lg border-body-700 border justify-between"
    >
      {/* Personal Details */}
      <>
        <h2 className="w-full font-medium text-lg text-primary-600 uppercase underline-offset-4">
          Personal Details
        </h2>

        <div className="flex w-full items-center justify-between gap-6">
          <ProfileField
            control={control}
            register={register}
            setValue={setValue}
          />

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full ms:w-[45%] md:w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"first_name"}
                placeholder={"Employee First Name"}
                title={"First Name"}
                validationSchema={{
                  required: "First Name is required!",
                  validate: (value) =>
                    !!value.trim() || "First Name is required!",
                }}
              />
            </div>

            <div className="w-full ms:w-[45%] md:w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"last_name"}
                placeholder={"Employee Last Name"}
                title={"Last Name"}
              />
            </div>

            <div className="w-full ms:w-[45%] md:w-[30%]">
              <DateField
                maxDate={new Date()}
                control={control}
                name={"dob"}
                title={"Date of Birth"}
                rules={{
                  required: "Date of Birth is required!",
                }}
              />
            </div>

            <div className="w-full ms:w-[45%] md:w-[30%]">
              <SelectField
                title="Gender"
                control={control}
                name={"gender"}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                rules={{
                  required: "Gender is required!",
                }}
              />
            </div>

            <div className="w-full ms:w-[45%] md:w-[30%]">
              <InputField
                type="tel"
                errors={errors}
                register={register}
                name={"primary_phone"}
                placeholder={"Phone Number"}
                title={"Phone Number"}
                validationSchema={{
                  required: "Phone Number is required!",
                }}
              />
            </div>

            <div className="w-full ms:w-[45%] md:w-[30%]">
              <InputField
                type="tel"
                errors={errors}
                register={register}
                name={"alternate_phone"}
                placeholder={"Alternate Number"}
                title={"Alternate Number"}
                validationSchema={{
                  required: "Alternate Phone Number is required!",
                }}
              />
            </div>

            <div className="w-full ms:w-[45%] md:w-[30%]">
              <InputField
                type="email"
                errors={errors}
                register={register}
                name={"email"}
                placeholder={"Employee Email Address"}
                title={"Email"}
                validationSchema={{
                  required: "Email is required!",
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email!",
                  },
                }}
              />
            </div>

            <div className="w-full ms:w-[45%] md:w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"aadhar"}
                placeholder={"Aadhar Number"}
                title={"Aadhar Number"}
                validationSchema={{
                  required: "Aadhar Number is required!",
                  pattern: {
                    value: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
                    message: "Enter a valid Aadhar number!",
                  },
                }}
              />
            </div>

            <div className="w-full ms:w-[45%] md:w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"pan"}
                placeholder={"PAN Number"}
                title={"PAN Number"}
                validationSchema={{
                  required: "PAN Number is required!",
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: "Enter a valid PAN Number!",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </>

      {/* Address Details */}
      <>
        <h2 className="w-full font-medium text-lg text-primary-600 uppercase underline-offset-4 mt-4">
          Address Details
        </h2>

        <>
          <h3 className="w-full text-primary-600 text-lg font-semibold">
            Present Address
          </h3>

          <div className="w-full ms:w-[45%] md:w-[30%]">
            <InputField
              errors={errors}
              register={register}
              name={"present_address"}
              placeholder={"Address"}
              title={"Address"}
              validationSchema={{
                required: "Address is required!",
                validate: (value) => !!value.trim() || "Address is required!",
              }}
            />
          </div>

          <div className="w-full ms:w-[45%] md:w-[30%]">
            <InputField
              errors={errors}
              register={register}
              name={"present_landmark"}
              placeholder={"Landmark"}
              title={"Landmark"}
              validationSchema={{
                required: "Landmark is required!",
                validate: (value) => !!value.trim() || "Landmark is required!",
              }}
            />
          </div>

          <div className="w-full ms:w-[45%] md:w-[30%]">
            <InputField
              errors={errors}
              register={register}
              name={"present_pincode"}
              placeholder={"Pincode"}
              title={"Pincode"}
              validationSchema={{
                required: "Pincode is required!",
                pattern: {
                  value: /^[1-9]{1}[0-9]{2}[0-9]{3}$/,
                  message: "Enter a valid pincode!",
                },
              }}
            />
          </div>

          <div className="w-full ms:w-[45%] md:w-[30%]">
            <StateField
              title="State"
              control={control}
              name={"present_state"}
              rules={{
                required: "State is required!",
              }}
            />
          </div>

          <div className="w-full ms:w-[45%] md:w-[30%]">
            <InputField
              errors={errors}
              register={register}
              name={"present_district"}
              placeholder={"District"}
              title={"District"}
              validationSchema={{
                required: "District is required!",
                validate: (value) => !!value.trim() || "District is required!",
              }}
            />
          </div>

          <div className="w-full ms:w-[45%] md:w-[30%]">
            <InputField
              errors={errors}
              register={register}
              title={"Tehsil"}
              name={"present_tehsil"}
              placeholder={"Tehsil"}
              validationSchema={{
                required: "Tehsil is required!",
                validate: (value) => !!value.trim() || "Tehsil is required!",
              }}
            />
          </div>
        </>

        <>
          <PermanentFields
            errors={errors}
            setValue={setValue}
            control={control}
            register={register}
          />
        </>
      </>

      {/* Bank Details */}
      <>
        <h2 className="w-full font-medium text-lg text-primary-600 uppercase underline-offset-4 mt-4">
          Bank Details
        </h2>
        <div className="w-full ms:w-[45%] md:w-[30%]">
          <InputField
            errors={errors}
            register={register}
            name={"beneficiary_name"}
            placeholder={"Beneficiary Name"}
            title={"Beneficiary Name"}
            validationSchema={{
              required: "Address is required!",
              validate: (value) =>
                !!value.trim() || "Beneficiary Name is required!",
            }}
          />
        </div>

        <div className="w-full ms:w-[45%] md:w-[30%]">
          <InputField
            errors={errors}
            register={register}
            name={"account_number"}
            placeholder={"Account Number"}
            title={"Account Number"}
            validationSchema={{
              required: "Account Number is required!",
              validate: (value) =>
                !!value.trim() || "Account Number is required!",
            }}
          />
        </div>

        <div className="w-full ms:w-[45%] md:w-[30%]">
          <InputField
            errors={errors}
            register={register}
            name={"bank_name"}
            placeholder={"Bank Name"}
            title={"Bank Name"}
            validationSchema={{
              required: "Bank Name is required!",
              validate: (value) => !!value.trim() || "Bank Name is required!",
            }}
          />
        </div>

        <div className="w-full ms:w-[45%] md:w-[30%]">
          <InputField
            errors={errors}
            register={register}
            name={"branch_name"}
            placeholder={"Branch Name"}
            title={"Branch Name"}
            validationSchema={{
              required: "Branch Name is required!",
              validate: (value) => !!value.trim() || "Branch Name is required!",
            }}
          />
        </div>

        <div className="w-full ms:w-[45%] md:w-[30%]">
          <InputField
            errors={errors}
            register={register}
            name={"ifsc_code"}
            placeholder={"IFSC Code"}
            title={"IFSC Code"}
            validationSchema={{
              required: "IFSC  Code is required!",
              validate: (value) => !!value.trim() || "IFSC Code is required!",
            }}
          />
        </div>

        <div className="w-full ms:w-[45%] md:w-[30%]">
          <SelectField
            title="Account Type"
            control={control}
            name={"account_type"}
            options={[
              { value: "savings", label: "Savings Account" },
              { value: "current Account", label: "Current Account" },
            ]}
            rules={{
              required: "Reporting Manager is required!",
            }}
          />
        </div>
      </>

      {/* Professional Details */}
      <>
        <h2 className="w-full font-medium text-lg text-primary-600 uppercase underline-offset-4 mt-4">
          Professional Details
        </h2>

        <div className="w-full ms:w-[45%] md:w-[30%]">
          <SelectField
            title="Role"
            control={control}
            name={"role"}
            options={[
              { value: "subadmin", label: "subadmin" },
              { value: "user", label: "user" },
            ]}
            rules={{
              required: "Role is required!",
            }}
          />
        </div>

        {type === "edit" ? (
          <>
            <OldEmployeeSubordinatesField
              selectedOptions={formData?.selectedSubordinates}
              options={formData.available_subordinates}
              control={control}
              unregister={unregister}
            />

            <OldEmployeeSuperVisorField
              options={formData.available_supervisors}
              control={control}
              unregister={unregister}
            />
          </>
        ) : (
          <>
            <NewEmployeeSubordinatesField
              selectedOptions={formData?.selectedSubordinates}
              control={control}
              unregister={unregister}
            />

            <NewEmployeeSuperVisorField
              control={control}
              unregister={unregister}
            />
          </>
        )}

        <div className="w-full ms:w-[45%] md:w-[30%]">
          <InputField
            errors={errors}
            register={register}
            name={"designation"}
            placeholder={"Designation"}
            title={"Designation "}
            validationSchema={{
              required: "Designation is required!",
              validate: (value) => !!value.trim() || "Designation is required!",
            }}
          />
        </div>

        {type === "edit" || (
          <div className="w-full ms:w-[45%] md:w-[30%]">
            <DateField
              control={control}
              minDate={new Date()}
              name={"doj"}
              title={"Date of Joining"}
              rules={{
                required: "Date of Joining is required!",
              }}
            />
          </div>
        )}
      </>

      {/* Submit Button */}
      <div className="w-full justify-end flex gap-4 mt-4 ml-auto">
        {type === "edit" && (
          <>
            <Button onClick={inactiveCallback} variant="red">
              Inactive
            </Button>

            <Button onClick={resetPassword} variant="yellow">
              Reset Pasword
            </Button>
          </>
        )}

        <Button
          disabled={submitMutation.isLoading || submitMutation.isSuccess}
          className="disabled:animate-pulse"
          type="submit"
        >
          Save Details
        </Button>
      </div>
    </form>
  );
}

function NewEmployeeSuperVisorField({ control, unregister }) {
  const { networkRequest } = useData();

  const watchRole = useWatch({ control, name: "role" });

  const supervisorsQuery = useQuery({
    queryKey: ["supervisors"],
    queryFn: fetchData,
    staleTime: 0,
    // enabled,
  });

  async function fetchData() {
    const result = await networkRequest("get_supervisors");
    if (!result.success) throw result;
    return result.data;
  }

  useEffect(() => {
    return () => {
      unregister("supervisor");
    };
  }, []);

  const supervisorOptions = useMemo(() => {
    let options = supervisorsQuery.data || [];
    return options.map((supervisor) => ({
      ...supervisor,
      label: supervisor.first_name + " " + supervisor.last_name,
      value: supervisor.emp_id,
    }));
  }, [supervisorsQuery.data]);

  if (watchRole !== "user") return null;
  return (
    <div className="w-full ms:w-[45%] md:w-[30%]">
      <SelectField
        isClearable={true}
        disabled={supervisorsQuery.isLoading}
        isLoading={supervisorsQuery.isLoading}
        control={control}
        name={"supervisor"}
        options={supervisorOptions}
        title={"Supervisor"}
        placeholder={supervisorsQuery.isLoading ? "Loading..." : "Select..."}
        formatOptionLabel={(option) => (
          <span className="">
            <div div className="capitalize">
              {" "}
              {option.label}
            </div>
            <div className="text-xs mt-1">{option.designation}</div>
          </span>
        )}
      />
    </div>
  );
}

function NewEmployeeSubordinatesField({ control, unregister }) {
  const { networkRequest } = useData();

  const watchRole = useWatch({ control, name: "role" });

  const subordinatesQuery = useQuery({
    queryKey: ["subordinates"],
    queryFn: fetchData,
    staleTime: 0,
  });

  async function fetchData() {
    const result = await networkRequest("get_subordinates");
    if (!result.success) throw result;
    return result.data;
  }

  useEffect(() => {
    return () => {
      unregister("subordiantes");
    };
  }, []);

  const subordinatesOptions = useMemo(() => {
    let options = subordinatesQuery.data || [];
    return options.map((subordinate) => ({
      ...subordinate,
      label: subordinate.first_name + " " + subordinate.last_name,
      value: subordinate.emp_id,
    }));
  }, [subordinatesQuery.data]);

  if (watchRole !== "subadmin") return null;
  return (
    <div className="w-full ms:w-[45%] md:w-[30%]">
      <SelectField
        isClearable={true}
        isMulti={true}
        disabled={subordinatesQuery.isLoading}
        isLoading={subordinatesQuery.isLoading}
        control={control}
        name={"subordinates"}
        options={subordinatesOptions}
        title={"Subordiantes"}
        placeholder={subordinatesQuery.isLoading ? "Loading..." : "Select..."}
        formatOptionLabel={(option) => (
          <span className="">
            <div div className="capitalize">
              {" "}
              {option.label}
            </div>
            <div className="text-xs mt-1">{option.designation}</div>
          </span>
        )}
      />
    </div>
  );
}

function OldEmployeeSuperVisorField({ control, unregister, options }) {
  const watchRole = useWatch({ control, name: "role" });

  const supervisorOptions = useMemo(() => {
    let temp = options || [];
    return temp.map((supervisor) => ({
      ...supervisor,
      label: supervisor.first_name + " " + supervisor.last_name,
      value: supervisor.emp_id,
    }));
  }, [options]);

  useEffect(() => {
    return () => {
      unregister("supervisor");
    };
  }, []);

  if (watchRole !== "user") return null;
  return (
    <div className="w-full ms:w-[45%] md:w-[30%]">
      <SelectField
        isClearable={true}
        control={control}
        name={"supervisor"}
        options={supervisorOptions}
        title={"Supervisor"}
        placeholder={"Select..."}
        formatOptionLabel={(option) => (
          <span className="">
            <div div className="capitalize">
              {" "}
              {option.label}
            </div>
            <div className="text-xs mt-1">{option.designation}</div>
          </span>
        )}
      />
    </div>
  );
}

function OldEmployeeSubordinatesField({
  control,
  unregister,
  options,
  selectedOptions,
}) {
  const watchRole = useWatch({ control, name: "role" });

  const subordinatesOptions = useMemo(() => {
    let temp = options ? [...options] : [];
    if (selectedOptions) {
      selectedOptions.forEach((option) => temp.push(option));
    }
    return temp.map((subordinate) => ({
      ...subordinate,
      label: subordinate.first_name + " " + subordinate.last_name,
      value: subordinate.emp_id,
    }));
  }, [options]);

  useEffect(() => {
    return () => {
      unregister("subordiantes");
    };
  }, []);

  if (watchRole !== "subadmin") return null;
  return (
    <div className="w-full ms:w-[45%] md:w-[30%]">
      <SelectField
        isClearable={true}
        isMulti={true}
        control={control}
        name={"subordinates"}
        options={subordinatesOptions}
        title={"Subordiantes"}
        placeholder={"Select..."}
        formatOptionLabel={(option) => (
          <span className="">
            <div div className="capitalize">
              {" "}
              {option.label}
            </div>
            <div className="text-xs mt-1">{option.designation}</div>
          </span>
        )}
      />
    </div>
  );
}

function ProfileField({ control, register, setValue }) {
  const watchProfile = useWatch({ control, name: "media" });
  return (
    <div className="flex min-w-[18%] max-w-[18%] h-full items-center justify-center  flex-col gap-1">
      <div className="my-auto flex w-full h-[82%] flex-col border-body-700  border-4 border-dotted items-center justify-center overflow-hidden">
        <label
          title="profile photo"
          className="p-1 cursor-pointer h-full flex items-center justify-center"
        >
          <input
            accept="image/*"
            type="file"
            className="opacity-0 absolute"
            {...register("media")}
          />

          {!watchProfile?.length ? (
            <div className="text-body-500 font-medium text-lg text-center p-2">
              Upload a profile photo
            </div>
          ) : (
            // <></>

            <div className="relative h-full w-full flex items-center justify-center">
              <img
                className="w-full h-auto"
                src={URL.createObjectURL(watchProfile[0])}
                alt="Profile Photo"
              />

              <button
                type="button"
                onClick={() => setValue("media", null)}
                title="remove image"
                className="absolute w-4 h-4 text-sm flex items-center justify-center top-0 right-0 bg-red-800 rounded-sm p-2 text-red-200 z-50"
              >
                X
              </button>
            </div>
          )}
        </label>
      </div>

      <div className="mt-auto">Profile Photo</div>
    </div>
  );
}

function PermanentFields({ control, register, errors, setValue }) {
  const fields = [
    "address",
    "landmark",
    "pincode",
    "state",
    "district",
    "tehsil",
  ];
  const watchPresent = useWatch({
    control,
    name: fields.map((field) => "present_" + field),
  });

  const [checked, setChecked] = useState();

  useEffect(() => {
    if (checked) {
      watchPresent.forEach((field_value, index) => {
        setValue("permanent_" + fields[index], field_value);
      });
    }
  }, [checked, watchPresent]);

  return (
    <>
      <div className="w-full mt-4">
        <h3 className=" text-primary-600 font-semibold text-lg">
          Permanent Address
        </h3>

        <div className="flex gap-2 items-center mt-2 text-sm">
          <UncontrolledCheckBox
            checked={checked}
            onChange={() => setChecked((pre) => !pre)}
          />
          <span className="text-body-400 text-base font-medium">
            Same as Present Address ?
          </span>
        </div>
      </div>
      <div className="w-full ms:w-[45%] md:w-[30%]">
        <InputField
          disabled={checked}
          errors={errors}
          register={register}
          name={"permanent_address"}
          placeholder={"Address"}
          title={"Address"}
          validationSchema={{
            required: "Address is required!",
            validate: (value) => !!value.trim() || "Address is required!",
          }}
        />
      </div>

      <div className="w-full ms:w-[45%] md:w-[30%]">
        <InputField
          disabled={checked}
          errors={errors}
          register={register}
          name={"permanent_landmark"}
          placeholder={"Landmark"}
          title={"Landmark"}
          validationSchema={{
            required: "Landmark is required!",
            validate: (value) => !!value.trim() || "Landmark is required!",
          }}
        />
      </div>

      <div className="w-full ms:w-[45%] md:w-[30%]">
        <InputField
          disabled={checked}
          errors={errors}
          register={register}
          name={"permanent_pincode"}
          placeholder={"Pincode"}
          title={"Pincode"}
          validationSchema={{
            required: "Pincode is required!",
            pattern: {
              value: /^[1-9]{1}[0-9]{2}[0-9]{3}$/,
              message: "Enter a valid pincode!",
            },
          }}
        />
      </div>

      <div className="w-full ms:w-[45%] md:w-[30%]">
        <StateField
          disabled={checked}
          title="State"
          control={control}
          name={"permanent_state"}
          rules={{
            required: "State is required!",
          }}
        />
      </div>

      <div className="w-full ms:w-[45%] md:w-[30%]">
        <InputField
          disabled={checked}
          errors={errors}
          register={register}
          name={"permanent_district"}
          placeholder={"District"}
          title={"District"}
          validationSchema={{
            required: "District is required!",
            validate: (value) => !!value.trim() || "District is required!",
          }}
        />
      </div>

      <div className="w-full ms:w-[45%] md:w-[30%]">
        <InputField
          disabled={checked}
          errors={errors}
          register={register}
          title={"Tehsil"}
          name={"permanent_tehsil"}
          placeholder={"Tehsil"}
          validationSchema={{
            required: "Tehsil is required!",
            validate: (value) => !!value.trim() || "Tehsil is required!",
          }}
        />
      </div>
    </>
  );
}

function StateField({ name, control, title, rules, disabled }) {
  const { networkRequest } = useData();
  const statesQuery = useGetIndianStates(networkRequest);

  const statesOptions = useMemo(() => {
    if (!statesQuery.data) return [];
    return statesQuery.data.map((state) => ({
      label: state,
      value: state,
    }));
  }, [statesQuery.data]);

  return (
    <SelectField
      disabled={statesQuery.isLoading || disabled}
      isLoading={statesQuery.isLoading}
      control={control}
      name={name}
      title={title}
      placeholder={statesQuery.isLoading ? "Loading..." : "Select..."}
      options={statesOptions}
      rules={rules}
    />
  );
}
