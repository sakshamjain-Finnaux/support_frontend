import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Button from "@/components/ui/button/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  Plus,
  X,
} from "lucide-react";

import DateField from "../../../components/form_elements/date_field/DateField";
import useUI from "../../../contexts/UIContext";
import useGetSubOrdinates from "../../../hooks/useGetSubOrdinates";

export default function AssignForm({ networkRequest, issueId, show }) {
  const { closeOverlay, toast } = useUI();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      assign_to: [],
      priority: "",
      target_date: null,
      msg: "",
      designation: "",
    },
  });

  const subOrdinates = useGetSubOrdinates(networkRequest);
  
  // Watchers
  const designationValue = useWatch({ control, name: "designation" });
  const assignedIds = useWatch({ control, name: "assign_to" }) || [];

  // Filtered Options Logic
  const subOrdinatesOptions = useMemo(() => {
    if (!subOrdinates.data) return [];
    return subOrdinates.data
      .filter(
        (subOrdinate) =>
          (subOrdinate.designation || "").toLowerCase() ===
          (designationValue || "").toLowerCase(),
      )
      .map((subOrdinate) => ({
        ...subOrdinate,
        label: subOrdinate.first_name + " " + subOrdinate.last_name,
        value: subOrdinate.emp_id,
      }));
  }, [subOrdinates.data, designationValue]);

  const designationOption = useMemo(() => {
    if (!subOrdinates?.data) return [];
    const uniqueMap = new Map();
    subOrdinates.data.forEach((item) => {
      if (item.designation) {
        const lower = item.designation.toLowerCase();
        if (!uniqueMap.has(lower)) {
          uniqueMap.set(lower, item.designation);
        }
      }
    });
    return Array.from(uniqueMap.values()).map((designation) => ({
      label: designation,
      value: designation,
    }));
  }, [subOrdinates?.data]);

  // Selected Assignees Objects
  const selectedAssignees = useMemo(() => {
    if (!subOrdinates.data) return [];
    return subOrdinates.data.filter((u) => assignedIds.includes(u.emp_id));
  }, [subOrdinates.data, assignedIds]);

  // Mutation
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
    const payload = {
      ...data,
      issue_id: parseInt(issueId),
    };
    const result = await networkRequest("assign_issue", payload);
    if (!result.success) throw result;
    return result;
  }

  const handleRemoveAssignee = (id) => {
    const next = assignedIds.filter((x) => x !== id);
    setValue("assign_to", next);
  };

  const handleAddAssignee = (id) => {
    if (!assignedIds.includes(id)) {
      setValue("assign_to", [...assignedIds, id]);
      setIsAdding(false);
      setValue("designation", ""); // Reset designation
    }
  };

  return (
    <form
      onSubmit={handleSubmit(assignMutation.mutate)}
      className="w-full flex flex-col gap-6"
    >
      {/* Assignees Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-body-400 uppercase tracking-wider">
            Assignees
          </Label>
          <span className="text-xs text-body-500">
            {selectedAssignees.length} selected
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
           {/* Selected Assignees Cards */}
           {selectedAssignees.map((user) => (
             <div
               key={user.emp_id}
               className="group relative flex items-center gap-3 rounded-lg border border-body-800 bg-body-900/50 p-3 transition-all hover:border-body-700 hover:bg-body-900 animate-in fade-in zoom-in-95 duration-200"
             >
               <Avatar className="h-10 w-10 border border-body-700">
                 <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                   {user.first_name?.[0]}
                   {user.last_name?.[0]}
                 </AvatarFallback>
               </Avatar>
               <div className="flex-1 overflow-hidden">
                 <h4 className="truncate text-sm font-medium text-body-100">
                   {user.first_name} {user.last_name}
                 </h4>
                 <p className="truncate text-xs text-body-400">
                   {user.designation}
                 </p>
               </div>
               <button
                 type="button"
                 onClick={() => handleRemoveAssignee(user.emp_id)}
                 className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-all hover:bg-red-600 group-hover:flex"
               >
                 <X className="h-3 w-3" />
               </button>
             </div>
           ))}

          {/* Add New Assignee Card or Form */}
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex h-full min-h-[70px] w-full items-center justify-center gap-2 rounded-lg border border-dashed border-body-700 bg-body-950/30 text-body-400 transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">Add Assignee</span>
            </button>
          ) : (
            <div className="col-span-1 sm:col-span-2 rounded-lg border border-body-800 bg-body-900/20 p-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-body-400">Select Person</span>
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-body-500 hover:text-body-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {/* Step 1: Designation */}
                 <Controller
                    control={control}
                    name="designation"
                    render={({ field }) => (
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        options={designationOption}
                        placeholder="Select Designation..."
                        disabled={subOrdinates.isLoading}
                        title="Designation"
                      />
                    )}
                 />

                 {/* Step 2: Assignee (Filtered) */}
                 <Combobox
                    value={""} // Always empty to act as "Add" trigger
                    onChange={handleAddAssignee}
                    options={subOrdinatesOptions.filter(o => !assignedIds.includes(o.emp_id))}
                    placeholder={designationValue ? "Select Person..." : "Select Designation First"}
                    disabled={!designationValue || subOrdinates.isLoading}
                    title="Add Assignee"
                    renderItem={(item) => (
                       <div className="flex flex-col">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-body-500">{item.designation}</span>
                       </div>
                    )}
                 />
              </div>
            </div>
          )}
        </div>

        {errors?.assign_to && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.assign_to.message}
          </p>
        )}

        {/* Hidden Input for validation */}
        <input
          type="hidden"
          {...register("assign_to", {
            required: "Select at least one person!",
            validate: (val) => val.length > 0 || "Select at least one person!",
          })}
        />
      </div>

      <Separator className="bg-body-800" />

      {/* Priority */}
      {show.priority && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-body-400 uppercase tracking-wider">
            Priority
          </Label>
          <Controller
            control={control}
            name="priority"
            rules={{ required: "Select priority!" }}
            render={({ field }) => (
              <Combobox
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
                placeholder="Select Priority"
              />
            )}
          />
          {errors?.priority && (
             <p className="text-xs text-red-500 flex items-center gap-1">
               <AlertCircle className="h-3 w-3" /> {errors.priority.message}
             </p>
          )}
        </div>
      )}

      {/* Target Date */}
      {show.target_date && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-body-400 uppercase tracking-wider">
            Target Date
          </Label>
          <DateField
            minDate={new Date()}
            control={control}
            name={"target_date"}
            title={"Target Date"}
            rules={{
              required: "Select target date!",
            }}
          />
          {errors?.target_date && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.target_date.message}
            </p>
          )}
        </div>
      )}

      {/* Remarks */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-body-400 uppercase tracking-wider">
          Remarks
        </Label>
        <Textarea
          placeholder="Add detailed instructions..."
          className="min-h-[120px] resize-none bg-body-950 border-body-800 text-text focus:ring-primary/20 focus:border-primary/50"
          {...register("msg", {
            required: "Remark is required!",
            maxLength: {
              value: 251,
              message: "Max Length is 251!",
            },
          })}
        />
        {errors?.msg && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.msg.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col gap-3">
        <Button
          type="submit"
          variant="blue"
          disabled={assignMutation.isLoading || assignMutation.isSuccess}
          className="h-10 w-full shadow-lg shadow-blue-900/20 disabled:animate-pulse"
        >
          {assignMutation.isLoading ? "Assigning..." : "Assign Issue"}
        </Button>
      </div>
    </form>
  );
}

/** Combobox Component (Reused for all Selects) */
function Combobox({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  title,
  renderItem,
}) {
  const [open, setOpen] = useState(false);

  // For display value in trigger
  const selected = options.find(
    (o) => o.value?.toString().toLowerCase() === value?.toString().toLowerCase(),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-10 px-3 justify-between bg-body-950 border-body-800 text-text hover:bg-body-900 hover:border-body-700 transition-all",
            !selected && !value && "text-body-500",
            open && "ring-2 ring-primary/20 border-primary/50",
          )}
        >
          <span className="truncate capitalize font-medium">
            {selected ? selected.label : value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[260px] p-0 bg-body-950 border border-body-800 shadow-xl rounded-lg"
      >
        <Command className="bg-body-950 text-text">
          <CommandInput placeholder={`Search ${title || "..."}`} className="h-9" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto p-1">
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label || opt.value} // Use label for search if provided
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "px-2 py-1.5 rounded-md cursor-pointer",
                    "flex items-center gap-2",
                    "text-sm text-body-200",
                    "aria-selected:bg-body-900 aria-selected:text-white",
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 text-primary shrink-0",
                      value?.toString().toLowerCase() === opt.value?.toString().toLowerCase()
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {renderItem ? renderItem(opt) : <span className="capitalize">{opt.label}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
