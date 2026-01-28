import { EyeHideIcon, EyeShowIcon } from "../../assets/Icons/Icons";
import { useState } from "react";

export function InputField({
  register,
  validationSchema,
  placeholder,
  title,
  errors,
  name,
  type = "text",
  disabled = false,
}) {
  return (
    <div className="w-full relative">
      <label className="block">
        <div className="mb-1">{title}</div>
        <input
          disabled={disabled}
          type={type}
          className={`border-2 bg-body-940 rounded-lg block w-full p-2 focus:ring-1 ring-opacity-50 ring-offset-1 ring-offset-transparent outline-none disabled:bg-body-700 placeholder:text-body-500 ${errors[name] ? "border-red-700 hover:border-red-900 ring-red-800" : "border-body-700 hover:border-body-800 ring-primary-700"}`}
          placeholder={placeholder}
          autoComplete="off"
          {...register(name, validationSchema)}
        />
      </label>
      {errors?.[name] && (
        <span className="absolute -bottom-4 text-xs text-error">
          {errors?.[name].message}
        </span>
      )}
    </div>
  );
}

export function PasswordField({
  disabled = false,
  register,
  validationSchema,
  placeholder,
  title,
  errors,
  name,
}) {
  const [showPassword, setShowPassword] = useState();

  return (
    <div className="w-full relative">
      <label className="">
        <div className="mb-1">{title}</div>
        <div
          className={`shadow-inner flex border-2 rounded-lg bg-body-940 ${errors[name] ? "border-red-700 hover:border-red-900 ring-red-800" : "border-body-700 hover:border-body-800 ring-primary-700"}`}
        >
          <input
            disabled={disabled}
            type={showPassword ? "text" : "password"}
            className={`flex-grow p-2 rounded-l-lg bg-transparent focus:ring-1 ring-opacity-50 ring-offset-1 ring-offset-transparent outline-none disabled:bg-body-700 placeholder:text-body-500 ${errors[name] ? "border-red-700 hover:border-red-900 ring-red-800" : "border-body-700 hover:border-body-800 ring-primary-700"}`}
            placeholder={placeholder}
            {...register(name, validationSchema)}
          />
          <button
            type="button"
            title={showPassword ? "hide password" : "show password"}
            className="text-body-400 hover:text-body-500 px-3 border-l text-lg border-body-700 focus:ring-0z"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <EyeHideIcon /> : <EyeShowIcon />}
          </button>
        </div>
      </label>
      {errors?.[name] && (
        <span className="absolute -bottom-4 text-xs text-error">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}

export function TextAreaField({
  disabled = false,
  register,
  validationSchema,
  placeholder,
  title,
  errors,
  name,
}) {
  return (
    <div className="w-full relative">
      <label className="block">
        <div className="mb-1"> {title}</div>
        <textarea
          disabled={disabled}
          className={`border-2 bg-body-940 rounded-lg block w-full p-2 min-h-[6rem] max-h-48 overflow-auto  focus:ring-1 ring-opacity-50 placeholder:text-body-500 ring-offset-1 ring-offset-transparent outline-none disabled:bg-body-700 ${errors?.[name] ? "border-red-700 hover:border-red-900 ring-red-800" : "border-body-700 hover:border-body-800 ring-primary-700"}`}
          placeholder={placeholder}
          autoComplete="off"
          {...register(name, validationSchema)}
        ></textarea>
      </label>
      {errors?.[name] && (
        <span className="absolute -bottom-4 text-xs text-error">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}

export function BrowseFileField({
  disabled = false,
  register,
  validationSchema,
  title,
  errors,
  name,
}) {
  return (
    <div className="w-full relative">
      <label>
        <div className="mb-1">{title}</div>
        <input
          disabled={disabled}
          className={`focus:ring-1 ring-opacity-50 ring-offset-1 ring-offset-transparent outline-none relative m-0 block w-full min-w-0 flex-auto rounded-lg border-2 border-solid border-body-600 hover:border-body-700 bg-clip-padding p-2 font-normal text-body-400 transition duration-300 ease-in-out  file:overflow-hidden file:rounded-md file:!border-r-0 file:border-0 file:bg-body-700 file:px-2 file:py-[0.32rem] file:text-body-300 placeholder:text-body-500 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-body-800 ${errors[name] ? "border-red-700 hover:border-red-900 ring-red-800" : "border-body-600 hover:border-body-700 ring-primary-700"}`}
          type="file"
          accept="image/*, video/*"
          multiple={true}
          {...register(name, validationSchema)}
        />
      </label>
      {errors?.[name] && (
        <span className="absolute -bottom-4 text-xs text-error">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}
