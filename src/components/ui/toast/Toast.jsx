import { useEffect, useRef, useState } from "react";
import "./toast.css"
import { InfoIcon, CheckIcon, WarningIcon, ErrorIcon, CloseIcon } from "../../../assets/Icons/Icons";
import useUI from "../../../contexts/UIContext";
const toastTypes = {
    success: {
        icon: <CheckIcon />,
        iconClass: "text-green-500",
        progressBarClass: "bg-green-600",
    },
    warning: {
        icon: <WarningIcon />,
        iconClass: "text-yellow-500",
        progressBarClass: "bg-yellow-600",
    },
    info: {
        icon: <InfoIcon />,
        iconClass: "text-blue-500",
        progressBarClass: "bg-blue-600",
    },
    error: {
        icon: <ErrorIcon />,
        iconClass: "text-red-500",
        progressBarClass: "bg-red-600",
    },
};
function Toast({ message, type, id }) {
    const { icon, iconClass, progressBarClass } = toastTypes[type];
    const { toast } = useUI();
    const timerID = useRef(null);
    const progressRef = useRef(null);
    const [dismissed, setDismissed] = useState(false);

    const handleMouseEnter = () => {
        clearTimeout(timerID.current);
        progressRef.current.style.animationPlayState = "paused";
    };

    const handleMouseLeave = () => {
        const remainingTime =
            (progressRef.current.offsetWidth /
                progressRef.current.parentElement.offsetWidth) *
            4000;

        progressRef.current.style.animationPlayState = "running";

        timerID.current = setTimeout(handleDismiss, remainingTime);
    };

    const handleDismiss = () => {
        setDismissed(true);
        setTimeout(() => {
            toast.remove(id);
        }, 400);
    };

    useEffect(() => {
        timerID.current = setTimeout(handleDismiss, 4000);

        return () => {
            clearTimeout(timerID.current);
        };
    }, []);


    return (
        <div
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={"text-text flex items-center bg-body-900 shadow-md rounded-md p-4 relative w-96 overflow-hidden border-2 border-body-800 animate-[slide-in_0.4s_ease-in-out_forwards] " + (dismissed ? "animate-[slide-out_0.4s_ease-in-out_forwards] z-[51]" : "")}
        >
            <span className={iconClass + " text-xl"}>{icon}</span>
            <p className="text-text-dark text-sm font-medium ml-3">{message}</p>
            <button className="cursor-pointer border-none bg-none ml-auto">
                <CloseIcon className='text-md text-text hover:text-text-dark' onClick={handleDismiss} />
            </button>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-10">
                <div ref={progressRef} className={`h-full animate-[progress-bar_4s_linear_forwards] ${progressBarClass}`}></div>
            </div>

        </div>
    )
}

export default Toast