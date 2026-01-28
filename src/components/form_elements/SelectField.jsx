import clsx from "clsx";
import { Controller } from "react-hook-form";
import Select, { components } from "react-select";
import { ArrowIcon, CloseIcon } from "../../assets/Icons/Icons";

const ValueContainer = ({ children, ...props }) => {
  let [values, input] = children;

  if (Array.isArray(values)) {
    values = `${values.length} selected`;
  }

  return (
    <components.ValueContainer {...props}>
      {values}
      {input}
    </components.ValueContainer>
  );
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <ArrowIcon className="rotate-180" />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <CloseIcon />
    </components.ClearIndicator>
  );
};

const MultiValueRemove = (props) => {
  return (
    <components.MultiValueRemove {...props}>
      <CloseIcon />
    </components.MultiValueRemove>
  );
};

const controlStyles = {
  base: "border-2 rounded-lg bg-body-940 hover:cursor-pointer outline border-body-700 hover:border-body-800",
  focus:
    "ring-1 ring-offset-1 ring-opacity-50 ring-offset-transparent ring-primary-800",
  nonFocus: "border-body-600 hover:border-body-700",
};
const placeholderStyles = "text-body-500 pl-1 py-0.5";
const selectInputStyles = "pl-1 py-0.5";
const valueContainerStyles = "p-2 gap-1";
const singleValueStyles = "leading-7 ml-1";
const multiValueStyles =
  "bg-body-800 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5";
const multiValueRemoveStyles =
  "border border-body-600 hover:text-red-800 text-gray-500 hover:border-red-400 rounded-md hover:bg-transparent";
const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles =
  "text-gray-500 p-1 rounded-md hover:bg-body-800 hover:text-red-600";
const indicatorSeparatorStyles = "bg-body-700";
const dropdownIndicatorStyles =
  "p-1 hover:bg-body-800 text-gray-500 rounded-md hover:text-body-400";
const menuStyles = "p-1 mt-2 border border-body-700 bg-body-940 rounded-lg";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
  base: "hover:cursor-pointer px-3 py-2 rounded border-2 border-transparent my-1",
  focus: "border-2 border-dotted !border-primary-500",
  selected: "opacity-40 bg-body-600",
};
const noOptionsMessageStyles =
  "text-body-400 p-2 bg-body-800 border border-dashed border-body-700 rounded-sm";

export default function SelectField({
  disabled = false,
  placeholder = "Select...",
  control,
  isMulti = false,
  options,
  name,
  rules = {},
  title,
  isLoading = false,
  defaultValue = null,
  formatOptionLabel = null,
  isClearable = false,
}) {
  return (
    <Controller
      defaultValue={defaultValue}
      name={name}
      rules={rules}
      control={control}
      render={({
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
      }) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value = options.filter((option) => value.includes(option.value));
          } else value = options.find((option) => value === option.value);
        }

        return (
          <div className="w-full relative">
            <label className="block">
              <div className="mb-1">{title}</div>
              <Select
                isClearable={isClearable}
                isLoading={isLoading}
                loadingMessage={"Loading..."}
                isDisabled={disabled}
                ref={ref}
                onChange={(option) => {
                  if (!option) onChange(null);
                  else if (isMulti) {
                    let selected = option?.map((obj) => obj.value);
                    onChange(selected);
                  } else onChange(option.value);
                }}
                value={value}
                isMulti={isMulti}
                closeMenuOnSelect={!isMulti}
                hideSelectedOptions={false}
                placeholder={placeholder}
                menuPlacement="auto"
                unstyled
                styles={{
                  input: (base) => ({
                    ...base,
                    "input:focus": {
                      boxShadow: "none",
                    },
                  }),
                  // On mobile, the label will truncate automatically, so we want to
                  // override that behaviour.
                  multiValueLabel: (base) => ({
                    ...base,
                    whiteSpace: "normal",
                    overflow: "visible",
                  }),
                  control: (base) => ({
                    ...base,
                    transition: "none",
                  }),
                }}
                components={{
                  DropdownIndicator,
                  ClearIndicator,
                  MultiValueRemove,
                  ValueContainer,
                }}
                classNames={{
                  control: ({ isFocused, isDisabled }) =>
                    clsx(
                      error &&
                        "!border-red-700 !ring-red-800 hover:!border-red-900",
                      isFocused ? controlStyles.focus : controlStyles.nonFocus,
                      isDisabled && "!bg-body-700",
                      controlStyles.base,
                    ),
                  placeholder: () => placeholderStyles,
                  input: () => selectInputStyles,
                  valueContainer: () => valueContainerStyles,
                  singleValue: () => singleValueStyles,
                  multiValue: () => multiValueStyles,
                  multiValueLabel: () => multiValueLabelStyles,
                  multiValueRemove: () => multiValueRemoveStyles,
                  indicatorsContainer: () => indicatorsContainerStyles,
                  clearIndicator: () => clearIndicatorStyles,
                  indicatorSeparator: () => indicatorSeparatorStyles,
                  dropdownIndicator: () => dropdownIndicatorStyles,
                  menu: () => menuStyles,
                  groupHeading: () => groupHeadingStyles,
                  option: ({ isFocused, isSelected }) =>
                    clsx(
                      isFocused && optionStyles.focus,
                      isSelected && optionStyles.selected,
                      optionStyles.base,
                    ),
                  noOptionsMessage: () => noOptionsMessageStyles,
                }}
                options={options}
                {...(formatOptionLabel ? { formatOptionLabel } : {})}
              />
            </label>
            {error && (
              <span className="absolute -bottom-4 text-xs text-error">
                {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
}
