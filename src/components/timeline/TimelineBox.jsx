import {
  BoxCheckIcon,
  CalendarIcon,
  AssignedIcon,
} from "../../assets/Icons/Icons";
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
  
  const isResolved = type === "resolved";
  const isCompleted = type === "completed";
  const isReverted = type === "reverted";
  
  const borderColor = isResolved 
    ? "border-green-600/50 bg-green-950/10" 
    : isCompleted
      ? "border-green-500/30 bg-green-950/5"
      : isReverted
        ? "border-red-500/30 bg-red-950/5"
        : "border-body-800 bg-body-900/40";
        
  const shadowClass = isResolved 
    ? "shadow-[0_0_15px_-3px_rgba(22,163,74,0.4)]" 
    : "shadow-sm";

  return (
    <div
      className={`text-sm space-y-3 border rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:border-opacity-80 ${borderColor} ${shadowClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-body-800/50">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
          isResolved ? "bg-green-500/20 text-green-400" :
          isCompleted ? "bg-green-500/10 text-green-400" :
          isReverted ? "bg-red-500/10 text-red-400" :
          "bg-blue-500/10 text-blue-400"
        }`}>
          {icons[type] || <AssignedIcon className="text-current" />}
          <span>{type}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 text-body-500 text-xs">
          <CalendarIcon className="text-amber-500/80" />
          <span>{new Date(date).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}</span>
        </span>
      </div>

      {/* From/To Section */}
      <div className="flex items-center gap-2 text-body-400">
        <div className="flex items-center gap-2 bg-body-950/50 px-3 py-1.5 rounded-lg border border-body-800/50">
           <span className="text-xs font-medium uppercase text-body-600">From</span>
           <span className="font-medium text-body-200 capitalize">{from}</span>
        </div>
        <span className="text-body-600">→</span>
        <div className="flex items-center gap-2 bg-body-950/50 px-3 py-1.5 rounded-lg border border-body-800/50">
           <span className="text-xs font-medium uppercase text-body-600">To</span>
           <span className="font-medium text-body-200 capitalize">{to}</span>
        </div>
      </div>

      {/* Assignees List */}
      {assignees && assignees.length > 0 && (
        <div className="mt-2 bg-body-950/30 rounded-lg p-3 border border-body-800/30">
          <div className="text-xs font-semibold text-body-500 uppercase mb-2 tracking-wide">Assignees Status</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignees.map((a) => (
              <li key={a.emp_id} className="flex items-center justify-between p-2 rounded-md bg-body-900/50 border border-body-800/50">
                <span className="font-medium text-body-300 capitalize truncate pr-2">{a.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${
                    a.status === "completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/20"
                      : a.status === "reverted"
                        ? "bg-red-500/20 text-red-400 border border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message */}
      {msg && (
         <div className="pt-2">
           <div className="text-body-300 bg-body-950/50 p-3 rounded-lg border border-body-800/50 whitespace-pre-wrap leading-relaxed">
             {msg}
           </div>
         </div>
      )}
    </div>
  );
}
