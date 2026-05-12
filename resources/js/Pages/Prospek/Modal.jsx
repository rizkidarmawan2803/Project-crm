export default function Modal({
    show,
    onClose,
    title,
    children,
    footer,
    width = "max-w-xl",
}) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className={`bg-white rounded-xl w-full ${width} max-h-[92vh] overflow-y-auto flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-200">
                    <h3 className="text-[15px] font-bold text-gray-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex-1">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-2 px-6 pb-5 pt-3.5 border-t border-gray-200">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Shared form atoms ── */
export function FormGrid({ children }) {
    return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

export function FormField({ label, full = false, children }) {
    return (
        <div className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
            <label className="text-[13px] text-gray-700">{label}</label>
            {children}
        </div>
    );
}

export const inputCls =
    "border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition w-full";

export const selectCls = inputCls + " cursor-pointer";
export const textareaCls = inputCls + " resize-none";

/* ── Shared button styles ── */
export function BtnPrimary({
    onClick,
    children,
    type = "button",
    disabled = false,
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="px-4 py-1.5 rounded-lg text-[13px] font-medium bg-blue-700 text-white border border-blue-700 hover:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {children}
        </button>
    );
}

export function BtnOutline({ onClick, children, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="px-4 py-1.5 rounded-lg text-[13px] font-medium bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 transition"
        >
            {children}
        </button>
    );
}
