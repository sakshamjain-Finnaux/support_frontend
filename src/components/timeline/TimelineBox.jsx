import {
  BoxCheckIcon,
  CalendarIcon,
  AssignedIcon,
} from "../../assets/Icons/Icons";
import { StatusCard, StatusBadge } from "../../components/ui/StatusComponents";

const icons = {
  reverted: (
    <AssignedIcon className="inline text-2xl rotate-180 text-red-700" />
  ),
  completed: <BoxCheckIcon className="inline text-2xl text-green-600" />,
  assigned: <AssignedIcon className="inline text-2xl text-sky-600" />,
  resolved: <BoxCheckIcon className="inline text-2xl text-green-600" />,
};

export default function TimelineBox({
  type = "",
  date,
  from,
  to,
  msg,
  assignees,
}) {
  type = type.toLowerCase();

  return (
    <StatusCard status={type} className="text-sm space-y-3 p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-body-800/50">
        <StatusBadge
          status={type}
          className="gap-2 px-3 py-1 font-semibold border-transparent" // Use transparent border for header style to match original
        >
          {icons[type] || <AssignedIcon className="text-current" />}
          <span>{type}</span>
        </StatusBadge>

        <span className="inline-flex items-center gap-1.5 text-body-500 text-xs">
          <CalendarIcon className="text-amber-500/80" />
          <span>
            {new Date(date).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </span>
      </div>

      {/* From/To Section */}
      <div className="flex items-center gap-2 text-body-400">
        <div className="flex items-center gap-2 bg-body-950/50 px-3 py-1.5 rounded-lg border border-body-800/50">
          <span className="text-xs font-medium uppercase text-body-600">
            From
          </span>
          <span className="font-medium text-body-200 capitalize">{from}</span>
        </div>
        <span className="text-body-600">→</span>
        <div className="flex items-center gap-2 bg-body-950/50 px-3 py-1.5 rounded-lg border border-body-800/50">
          <span className="text-xs font-medium uppercase text-body-600">
            To
          </span>
          <span className="font-medium text-body-200 capitalize">{to}</span>
        </div>
      </div>

      {/* Message Section - Preserving original logic if it existed or adding if implicit */}
      {msg && (
        <div className="text-body-300 bg-body-950/30 p-3 rounded-lg border border-body-800/30">
          {msg}
        </div>
      )}

      {/* Assignees List */}
      {assignees && assignees.length > 0 && (
        <div className="mt-2 bg-body-950/30 rounded-lg p-3 border border-body-800/30">
          <div className="text-xs font-semibold text-body-500 uppercase mb-2 tracking-wide">
            Assignees Status
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignees.map((a) => (
              <li
                key={a.emp_id}
                className="flex items-center justify-between p-2 rounded-md bg-body-900/50 border border-body-800/50"
              >
                <span className="font-medium text-body-300 capitalize truncate pr-2">
                  {a.name}
                </span>
                <StatusBadge
                  status={a.status}
                  className="text-[10px] px-2 py-0.5"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </StatusCard>
  );
}
