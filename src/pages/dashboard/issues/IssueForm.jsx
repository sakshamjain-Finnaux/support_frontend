import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";

import Button from "@/components/ui/button/Button";
import useUI from "../../../contexts/UIContext";

export default function IssueForm({ submitMutation, formData, formType }) {
  const {
    register,
    watch,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = formData
    ? useForm({
        defaultValues: { ...formData },
      })
    : useForm();

  const { closeOverlay } = useUI();
  const onlyView = formType === "view";
  const watchType = watch("issue_type");

  async function onSubmit(data) {
    if (submitMutation.isLoading) return;
    submitMutation.mutate(data);
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-0">
      <Card className="w-full bg-body-900 border border-body-800 rounded-2xl shadow-lg">
        {/* Header */}
        <CardHeader className="px-6 py-5 border-b border-body-800">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-base md:text-lg font-semibold text-text leading-none">
                {formType === "edit"
                  ? "Edit Issue"
                  : formType === "view"
                    ? "Issue Details"
                    : "Report Issue"}
              </CardTitle>

              <p className="text-xs text-body-400">
                Fill in issue details clearly so team can resolve quickly.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={closeOverlay}
              className="h-9 w-9 p-0 rounded-full text-red-600 hover:text-white hover:bg-red-500">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Body */}
        <CardContent className="px-6 py-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <FieldWrap
              className="md:col-span-2 pt-4"
              label="Title"
              error={errors?.title?.message}>
              <Input
                disabled={onlyView}
                placeholder="Issue Title"
                className="h-10 bg-body-950 border-body-800 text-text"
                {...register("title", { required: "Title is required" })}
              />
            </FieldWrap>

            {/* Type */}
            <FieldWrap label="Type" error={errors?.issue_type?.message}>
              <Controller
                control={control}
                name="issue_type"
                rules={{ required: "Select Issue Type!" }}
                render={({ field }) => (
                  <IssueTypePopover
                    value={field.value}
                    onChange={field.onChange}
                    disabled={onlyView}
                  />
                )}
              />
            </FieldWrap>

            {/* URL */}
            <div>
              {watchType === "web" ? (
                <FieldWrap label="Mention URL">
                  <Input
                    disabled={onlyView}
                    placeholder="https://example.com/page"
                    className="h-10 bg-body-950 border-body-800 text-text"
                    {...register("url")}
                  />
                </FieldWrap>
              ) : (
                <div className="hidden md:block h-10" />
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-medium text-body-200">
                Description
              </label>

              <Textarea
                disabled={onlyView}
                placeholder="Describe the issue"
                className="min-h-[140px] resize-none bg-body-950 border-body-800 text-text leading-relaxed"
                {...register("description", {
                  required: "Description is required!",
                  maxLength: { value: 251, message: "Max Length is 251!" },
                })}
              />

              <div className="flex justify-between items-center pt-1">
                <p
                  className={cn(
                    "text-xs",
                    errors?.description ? "text-red-500" : "text-body-500",
                  )}>
                  {errors?.description && errors.description.message}
                </p>

                <p className="text-xs text-body-500">
                  {watch("description")?.length || 0}/251
                </p>
              </div>
            </div>

            {/* Old Images */}
            {formData?.oldMedia && (
              <div className="md:col-span-2">
                <OldImagesField data={formData.oldMedia} setValue={setValue} />
              </div>
            )}

            {/* Upload */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-medium text-body-200">
                Screen Proof
              </label>

              <Input
                disabled={onlyView}
                type="file"
                multiple
                className="
                  h-14 bg-body-950 border-body-800 text-text
                  file:mr-3 file:h-9 file:rounded-md file:border-0
                  file:bg-body-600 file:px-4 file:text-xs file:font-medium file:text-body-100
                  hover:file:bg-body-700
                "
                {...register("media")}
              />

              <p className="text-[11px] text-body-500 pt-1">
                Upload screenshots to speed up debugging.
              </p>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 pt-4 mt-1 border-t border-body-800 flex justify-end gap-3">
              <Button
                type="button"
                variant="red"
                onClick={closeOverlay}
                className="h-10 px-4">
                Cancel
              </Button>

              {!onlyView && (
                <Button
                  type="submit"
                  variant="blue"
                  disabled={
                    submitMutation.isLoading || submitMutation.isSuccess
                  }
                  className="h-10 px-5 disabled:animate-pulse">
                  {submitMutation.isLoading
                    ? "Submitting..."
                    : formType === "edit"
                      ? "Save Changes"
                      : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/** wrapper */
function FieldWrap({ label, error, className, children }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-body-200">{label}</label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 pt-0.5">{error}</p>}
    </div>
  );
}

/** Issue Type */
function IssueTypePopover({ value, onChange, disabled }) {
  const options = [
    { value: "web", label: "Web" },
    { value: "app", label: "App" },
  ];

  const selected = options.find((o) => o.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full h-10 px-3 justify-between bg-body-950 border-body-800 text-text hover:bg-body-900",
            !selected && "text-body-500",
          )}>
          {selected ? selected.label : "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-48 p-1 bg-body-950 border border-body-800 shadow-md rounded-md">
        <Command className="bg-body-950 text-text">
          <CommandGroup className="p-0">
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.value}
                onSelect={() => onChange(opt.value)}
                className={cn(
                  "h-9 px-2 rounded-md cursor-pointer",
                  "flex items-center gap-2",
                  "text-lg text-body-200",
                  "hover:bg-body-900",
                )}>
                <Check
                  className={cn(
                    "h-4 w-4",
                    value === opt.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function OldImagesField({ data, setValue }) {
  const [imageData, setImageData] = useState(data);

  function removeImage(imageLink) {
    const arr = imageData.filter((link) => imageLink !== link);
    setImageData(arr);
    setValue("oldMedia", arr);
  }

  if (!imageData?.length) return null;

  return (
    <div className="flex flex-col gap-2 md:col-span-2">
      <p className="text-sm font-medium text-body-200">Old Images</p>

      <div className="max-h-44 overflow-y-auto flex flex-col gap-2 pr-1">
        {imageData.map((imageLink) => (
          <div
            key={imageLink}
            className="flex items-center justify-between rounded-lg border border-body-800 bg-body-950 px-3 py-2">
            <a
              href={imageLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-body-300 hover:underline underline-offset-4 max-w-[85%] truncate"
              title={imageLink}>
              {imageLink.substring(imageLink.lastIndexOf("/") + 1)}
            </a>

            <Button
              type="button"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-md hover:bg-body-800"
              onClick={() => removeImage(imageLink)}>
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
