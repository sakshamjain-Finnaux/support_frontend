export default function Button({ children, variant = "primary", onClick = null, type = "button", className="", disabled = false }) {

    const variants = {
        primary: "bg-teal-600 ring-teal-800 text-teal-50 border-teal-700",
        blue: "bg-blue-600 ring-blue-800 text-blue-50 border-blue-700",
        red: "bg-red-600 ring-red-800 text-red-200 border-red-800",
        yellow: "bg-yellow-500 ring-yellow-800 text-yellow-950 border-yellow-700",
        dark: "bg-body-800 ring-body-700 text-body-300 border-body-900"
    }

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}

            className={`inline-flex items-center justify-center gap-2 text-center duration-150 border-1 rounded-lg hover:brightness-75 px-4 py-1 focus:ring-1 outline-none ring-offset-transparent ring-offset-1 ring-opacity-70 disabled:bg-body-600 disabled:active:scale-100 active:scale-95 active:brightness-[0.85] disabled:!border-body-600 disabled:hover:brightness-100 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
            {children}
        </button>
    )
}