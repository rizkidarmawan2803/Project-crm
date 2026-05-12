import { useEffect } from "react";

export default function Toast({ show, message, onHide, duration = 3500 }) {
    useEffect(() => {
        if (show) {
            const t = setTimeout(onHide, duration);
            return () => clearTimeout(t);
        }
    }, [show]);

    return (
        <div
            className={`fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 bg-gray-900 text-white px-4 py-3 rounded-xl text-[13px] shadow-2xl transition-all duration-300 ${
                show
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3 pointer-events-none"
            }`}
        >
            <span className="text-green-400 text-lg">✓</span>
            <span>{message}</span>
        </div>
    );
}
