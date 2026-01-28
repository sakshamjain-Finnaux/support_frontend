export function UncontrolledInputField({
  placeholder,
  title,
  name,
  type = "text",
  disabled = false,
  className = "",
  ...rest
}) {
  return (
    <div className="w-full">
      <label className="block">
        {title && <div className="mb-1">{title}</div>}
        <input
          name={name}
          disabled={disabled}
          type={type}
          className={`border-2 bg-body-940 rounded-lg block w-full p-2 focus:ring-1 ring-opacity-50 ring-offset-1 ring-offset-transparent outline-none disabled:bg-body-700 placeholder:text-body-500 border-body-700 hover:border-body-800 ring-primary-700 ${className}`}
          placeholder={placeholder}
          autoComplete="off"
          {...rest}
        />
      </label>
    </div>
  );
}

export function UncontrolledCheckBox({ name, className, ...rest }) {
  return (
    <input
      className={`relative float-left h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-body-600 before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:content-[''] checked:border-primary-700 checked:bg-primary-700 checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] cursor-pointer ${className}`}
      {...rest}
      type="checkbox"
      name=""
    />
  );
}
