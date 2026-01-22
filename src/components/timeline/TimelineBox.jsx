import { BoxCheckIcon, CalendarIcon, AssignedIcon } from "../../assets/Icons/Icons"
const icons = {
    reverted: <AssignedIcon className="inline text-2xl rotate-180 text-red-700" />,
    completed: <BoxCheckIcon className="inline text-2xl text-green-600" />,
    assigned: <AssignedIcon className="inline text-2xl text-sky-600" />,
    resolved: <BoxCheckIcon className="inline text-2xl text-green-600" />,
}
export default function TimelineBox({ type = "", date, from, to, msg }) {
    type = type.toLowerCase();
    const className = type === "resolved" ? "border-green-600 shadow-green-800/40" : "border-body-700 shadow-body-800/70";
    return (
        <div className={`text-base space-y-2 border-2 p-4  bg-body-940 rounded-lg shadow-md  ${className}`}>
            <div className="space-x-8 flex items-center">
                <span className="inline-flex items-center gap-2">
                    {icons[type]}
                    <span className="capitalize font-medium">{type}</span>
                </span>

                <span className="inline-flex items-center gap-2">
                    <CalendarIcon className="inline text-xl font-sem text-amber-500" />
                    <span className="font-medium">{(new Date(date).toLocaleString())}</span>
                </span>
            </div>

            <div className="space-x-8 text-body-600">
                <span >
                    From: <span className="font-bold text-body-500 capitalize">{from}</span>
                </span>

                <span>
                    To: <span className="font-bold capitalize text-body-500">{to}</span>
                </span>
            </div>

            <div>
                <p>
                    {msg}
                </p>
            </div>

        </div>
    )
}