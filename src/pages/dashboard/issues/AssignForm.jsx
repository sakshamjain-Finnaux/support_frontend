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
    trigger,
  } = useForm({
    defaultValues: {
      assign_to: [],
      assignments: {},
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
    // Aggregate data from individual assignments
    const assignments = data.assignments || {};
    
    // 1. Combine Remarks
    let combinedMsg = "";
    assignedIds.forEach(id => {
      const details = assignments[id];
      const user = subOrdinates.data.find(u => u.emp_id === id);
      const name = user ? `${user.first_name} ${user.last_name}` : `User ${id}`;
      if (details?.msg) {
        combinedMsg += `[${name}]: ${details.msg}\n`;
      }
    });

    // 2. Determine Priority (Highest wins: High > Medium > Low)
    // We need to map priority strings to values to compare
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    let maxPriorityVal = 0;
    let finalPriority = "";
    
    assignedIds.forEach(id => {
        const p = assignments[id]?.priority;
        if (p && priorityWeight[p] > maxPriorityVal) {
            maxPriorityVal = priorityWeight[p];
            finalPriority = p;
        }
    });
    // Fallback if no priority selected (though validation should catch it)
    if (!finalPriority) finalPriority = "low"; 

    // 3. Determine Target Date (Earliest wins?)
    // Or should it be the latest? "Target Date" usually means deadline.
    // If I have a task for person A due tomorrow, and person B due next week.
    // The issue target date should probably be the LATEST one (when everything is done).
    // Let's go with Latest for safety, or Earliest?
    // User said "shift... so i can tell them what to do".
    // Let's pick the EARLIEST to be safe (don't miss deadlines).
    let finalTargetDate = null;
    assignedIds.forEach(id => {
        const d = assignments[id]?.target_date;
        if (d) {
            // d is likely YYYY-MM-DD string from DateField/MySQL helper
            if (!finalTargetDate || d < finalTargetDate) {
                finalTargetDate = d;
            }
        }
    });

    const payload = {
      assign_to: assignedIds,
      priority: finalPriority,
      target_date: finalTargetDate,
      msg: combinedMsg.trim(),
      issue_id: parseInt(issueId),
    };

    // If no msg, priority, or target_date were gathered (e.g. if logic fails), allow empty/defaults?
    // But validation requires them.

    const result = await networkRequest("assign_issue", payload);
    if (!result.success) throw result;
    return result;
  }

  const handleRemoveAssignee = (id) => {
    const next = assignedIds.filter((x) => x !== id);
    setValue("assign_to", next);
    // Optional: cleanup assignments[id] to save memory/clean state
    // setValue(`assignments.${id}`, undefined); 
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

        <div className="flex flex-col gap-3">
           {/* Selected Assignees Cards */}
           {selectedAssignees.map((user) => (
             <div
               key={user.emp_id}
               className="group relative flex flex-col gap-3 rounded-lg border border-body-800 bg-body-900/50 p-3 transition-all hover:border-body-700 hover:bg-body-900 animate-in fade-in zoom-in-95 duration-200"
             >
               <div className="flex items-center gap-3">
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
                    className="h-6 w-6 flex items-center justify-center rounded-md text-body-400 hover:text-red-500  transition-all"
                >
                    <X className="size-4" />
                </button>
               </div>

               <Separator className="bg-body-800/50" />

               {/* Individual Fields */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Priority */}
                  {show.priority && (
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-body-500 uppercase">Priority</Label>
                        <Controller
                            control={control}
                            name={`assignments.${user.emp_id}.priority`}
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                            <Combobox
                                value={field.value}
                                onChange={field.onChange}
                                options={[
                                { value: "low", label: "Low" },
                                { value: "medium", label: "Medium" },
                                { value: "high", label: "High" },
                                ]}
                                placeholder="Priority"
                                className="h-8 text-xs"
                            />
                            )}
                        />
                        {errors?.assignments?.[user.emp_id]?.priority && (
                             <p className="text-[10px] text-red-500">{errors.assignments[user.emp_id].priority.message}</p>
                        )}
                    </div>
                  )}

                  {/* Target Date */}
                  {show.target_date && (
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-body-500 uppercase">Target Date</Label>
                        <DateField
                            minDate={new Date()}
                            control={control}
                            name={`assignments.${user.emp_id}.target_date`}
                            rules={{ required: "Required" }}
                        />
                        {errors?.assignments?.[user.emp_id]?.target_date && (
                             <p className="text-[10px] text-red-500">{errors.assignments[user.emp_id].target_date.message}</p>
                        )}
                    </div>
                  )}
               </div>

               {/* Remarks */}
               <div className="space-y-1">
                    <Label className="text-[10px] font-semibold text-body-500 uppercase">Remarks / Instructions</Label>
                    <Textarea
                        placeholder={`Instructions for ${user.first_name}...`}
                        className="min-h-[80px] resize-none bg-body-950 border-body-800 text-text text-xs focus:ring-primary/20 focus:border-primary/50"
                        {...register(`assignments.${user.emp_id}.msg`, {
                            required: "Required",
                        })}
                    />
                    {errors?.assignments?.[user.emp_id]?.msg && (
                         <p className="text-[10px] text-red-500">{errors.assignments[user.emp_id].msg.message}</p>
                    )}
               </div>
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
                  className="hover:text-red-500  "
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
