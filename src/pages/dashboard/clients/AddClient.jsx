import { InputField } from "../../../components/form_elements/FormFields";
import { useForm, useWatch } from "react-hook-form";
import DateField from "../../../components/form_elements/date_field/DateField";
import SelectField from "../../../components/form_elements/SelectField";
import Button from "../../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { UncontrolledCheckBox } from "../../../components/form_elements/UnControlledFields";
export default function AddClient({ formData }) {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
    handleSubmit,
  } = formData
    ? useForm({
        defaultValues: {
          ...formData,
        },
      })
    : useForm();

  const fields = [
    "address",
    "landmark",
    "pincode",
    "state",
    "district",
    "tehsil",
  ];

  const watchRegisteredAddress = watch(fields.map((field) => "reg_" + field));

  const [checked, setChecked] = useState(false);

  const onChangeChecked = (event) => {
    if (event.target.checked) {
      watchRegisteredAddress.forEach((field_value, index) => {
        setValue("corp_" + fields[index], field_value);
      });
      setChecked(true);
    } else {
      watchRegisteredAddress.forEach((field_value, index) => {
        setValue("corp_" + fields[index], "");
      });
      setChecked(false);
    }
  };

  useEffect(() => {
    if (checked) {
      watchRegisteredAddress.forEach((field_value, index) => {
        setValue("corp_" + fields[index], field_value);
      });
    }
  }, [watchRegisteredAddress]);

  // function onSubmit(data) {
  //   console.log(data);
  // }
  return (
    <div className="flex-grow gap-6 flex flex-col">
      <h1 className="text-3xl font-medium text-primary-500 ">Add Client</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap gap-4 bg-body-800 bg-opacity-40 p-4 rounded-lg border-body-700 border justify-between"
      >
        {/* Personal Details */}
        <>
          <h2 className="w-full font-medium text-lg text-primary-600 uppercase underline-offset-4">
            Company Details
          </h2>

          <div className="flex w-full items-top justify-between gap-6">
            <ProfileField
              control={control}
              register={register}
              setValue={setValue}
            />

            <div className="flex flex-wrap gap-4 justify-between">
              <div className="w-[65%]">
                <InputField
                  errors={errors}
                  register={register}
                  name={"company_name"}
                  placeholder={"Company Name"}
                  title={"Company Name"}
                  validationSchema={{
                    required: "Company Name is required!",
                    validate: (value) =>
                      !!value.trim() || "Company Name is required!",
                  }}
                />
              </div>

              <div className="w-[30%]">
                <DateField
                  control={control}
                  name={"date_incorporation"}
                  title={"Date of Incorporation"}
                  rules={{
                    required: "Date of Incorporation is required!",
                  }}
                />
              </div>

              <div className="w-[30%]">
                <InputField
                  errors={errors}
                  register={register}
                  name={"cin_number"}
                  placeholder={"Cin  Number"}
                  title={"Cin/Reg. Number"}
                  validationSchema={{
                    required: "Cin Number is required!",
                  }}
                />
              </div>

              <div className="w-[30%]">
                <InputField
                  errors={errors}
                  register={register}
                  name={"pan"}
                  placeholder={"PAN Number"}
                  title={"PAN Number"}
                  validationSchema={{
                    required: "PAN Number is required!",
                  }}
                />
              </div>

              <div className="w-[30%]">
                <InputField
                  errors={errors}
                  register={register}
                  name={"gst_number"}
                  placeholder={"GST Number"}
                  title={"GST Number"}
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
              Registered Address
            </h3>

            <div className="w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"reg_address"}
                placeholder={"Address"}
                title={"Address"}
                validationSchema={{
                  required: "Address is required!",
                  validate: (value) => !!value.trim() || "Address is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"reg_landmark"}
                placeholder={"Landmark"}
                title={"Landmark"}
                validationSchema={{
                  required: "Landmark is required!",
                  validate: (value) =>
                    !!value.trim() || "Landmark is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"reg_pincode"}
                placeholder={"Pincode"}
                title={"Pincode"}
                validationSchema={{
                  required: "Pincode is required!",
                  validate: (value) => !!value.trim() || "Pincode is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <SelectField
                title="State"
                control={control}
                name={"reg_state"}
                options={[
                  { value: "subadmin", label: "Subadmin" },
                  { value: "user", label: "User" },
                ]}
                rules={{
                  required: "State is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <SelectField
                title="District"
                control={control}
                name={"reg_district"}
                options={[
                  { value: "subadmin", label: "Subadmin" },
                  { value: "user", label: "User" },
                ]}
                rules={{
                  required: "District is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <SelectField
                title="Tehsil"
                control={control}
                name={"reg_tehsil"}
                options={[
                  { value: "subadmin", label: "Subadmin" },
                  { value: "user", label: "User" },
                ]}
                rules={{
                  required: "Tehsil is required!",
                }}
              />
            </div>
          </>

          <>
            <div className="w-full mt-4">
              <h3 className=" text-primary-600 font-semibold text-lg">
                Corporate Address
              </h3>

              <div className="flex gap-2 items-center mt-2 text-sm">
                <UncontrolledCheckBox
                  checked={checked}
                  onChange={onChangeChecked}
                />
                <span className="text-body-400 text-base font-medium">
                  Same as Present Address ?
                </span>
              </div>
            </div>

            <div className="w-[30%]">
              <InputField
                disabled={checked}
                errors={errors}
                register={register}
                name={"corp_address"}
                placeholder={"Address"}
                title={"Address"}
                validationSchema={{
                  required: "Address is required!",
                  validate: (value) => !!value.trim() || "Address is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <InputField
                disabled={checked}
                errors={errors}
                register={register}
                name={"corp_landmark"}
                placeholder={"Landmark"}
                title={"Landmark"}
                validationSchema={{
                  required: "Landmark is required!",
                  validate: (value) =>
                    !!value.trim() || "Landmark is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <InputField
                disabled={checked}
                errors={errors}
                register={register}
                name={"corp_pincode"}
                placeholder={"Pincode"}
                title={"Pincode"}
                validationSchema={{
                  required: "Pincode is required!",
                  validate: (value) => !!value.trim() || "Pincode is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <SelectField
                disabled={checked}
                title="State"
                control={control}
                name={"corp_state"}
                options={[
                  { value: "subadmin", label: "Subadmin" },
                  { value: "user", label: "User" },
                ]}
                rules={{
                  required: "State is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <SelectField
                disabled={checked}
                title="District"
                control={control}
                name={"corp_district"}
                options={[
                  { value: "subadmin", label: "Subadmin" },
                  { value: "user", label: "User" },
                ]}
                rules={{
                  required: "District is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <SelectField
                disabled={checked}
                title="Tehsil"
                control={control}
                name={"corp_tehsil"}
                options={[
                  { value: "subadmin", label: "Subadmin" },
                  { value: "user", label: "User" },
                ]}
                rules={{
                  required: "Tehsil is required!",
                }}
              />
            </div>
          </>
        </>

        {/* Bank Details of Client */}
        <>
          <h2 className="w-full font-medium text-lg text-primary-600 uppercase underline-offset-4 mt-4">
            Bank Details
          </h2>
          <div className="w-[30%]">
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

          <div className="w-[30%]">
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

          <div className="w-[30%]">
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

          <div className="w-[30%]">
            <InputField
              errors={errors}
              register={register}
              name={"branch_name"}
              placeholder={"Branch Name"}
              title={"Branch Name"}
              validationSchema={{
                required: "Branch Name is required!",
                validate: (value) =>
                  !!value.trim() || "Branch Name is required!",
              }}
            />
          </div>

          <div className="w-[30%]">
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

          <div className="w-[30%]">
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

        {/* Contact Details of Client */}
        <>
          <h2 className="w-full font-medium text-lg text-primary-600 uppercase mt-4">
            Contact Details
          </h2>

          <>
            <h2 className="w-full text-lg text-primary-600 font-semibold">
              Primary Details
            </h2>

            <div className="w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"name1"}
                placeholder={"Contact Name"}
                title={"Contact Name"}
                validationSchema={{
                  required: "Contact Name is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <InputField
                type="tel"
                errors={errors}
                register={register}
                name={"phone1"}
                placeholder={"Contact Number"}
                title={"Contact Number"}
                validationSchema={{
                  required: "Phone Number is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <InputField
                type="email"
                errors={errors}
                register={register}
                name={"email1"}
                placeholder={"Contact Email Address"}
                title={"Contact Email"}
                validationSchema={{
                  required: "Email is required!",
                }}
              />
            </div>
          </>

          <>
            <h2 className="w-full text-lg text-primary-600 font-semibold">
              Alternate Details
            </h2>

            <div className="w-[30%]">
              <InputField
                errors={errors}
                register={register}
                name={"name2"}
                placeholder={"Contact Name"}
                title={"Contact Name"}
                validationSchema={{
                  required: "Contact Name is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <InputField
                type="tel"
                errors={errors}
                register={register}
                name={"phone2"}
                placeholder={"Contact Number"}
                title={"Contact Number"}
                validationSchema={{
                  required: "Phone Number is required!",
                }}
              />
            </div>

            <div className="w-[30%]">
              <InputField
                type="email"
                errors={errors}
                register={register}
                name={"email2"}
                placeholder={"Contact Email Address"}
                title={"Contact Email"}
                validationSchema={{
                  required: "Email is required!",
                }}
              />
            </div>
          </>
        </>

        {/* Submit Button */}
        <div className="w-full flex gap-4">
          <Button className="ml-auto mt-4" type="submit">
            Save Details
          </Button>
        </div>
      </form>
    </div>
  );
}

function ProfileField({ control, register, setValue }) {
  const watchCompanyLogo = useWatch({ control, name: "company_logo" });
  return (
    <div className="flex min-w-[18%] max-w-[18%] items-center justify-center flex-col gap-1 min-h-[16rem] max-h-[16rem]">
      <div className="my-auto flex w-full h-[82%] flex-col border-body-700  border-4 border-dotted items-center justify-center overflow-hidden">
        <label
          title="company logo"
          className="p-1 cursor-pointer h-full flex items-center justify-center"
        >
          <input
            accept="image/*"
            type="file"
            className="opacity-0 absolute"
            {...register("company_logo")}
          />

          {!watchCompanyLogo?.length ? (
            <div className="text-body-500 font-medium text-lg text-center p-2">
              Upload Compnay Logo
            </div>
          ) : (
            // <></>

            <div className="relative h-full w-full flex items-center justify-center">
              <img
                className="w-full h-auto"
                src={URL.createObjectURL(watchCompanyLogo[0])}
                alt="Company Logo"
              />

              <button
                type="button"
                onClick={() => setValue("company_logo", null)}
                title="remove image"
                className="absolute w-4 h-4 text-sm flex items-center justify-center top-0 right-0 bg-red-800 rounded-sm p-2 text-red-200 z-50"
              >
                X
              </button>
            </div>
          )}
        </label>
      </div>

      <div className="mt-auto">Company Logo</div>
    </div>
  );
}
