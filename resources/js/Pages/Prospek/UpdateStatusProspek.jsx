import { useState } from "react";
import axios from "axios";

export default function UpdateStatusProspek({ prospek, onBack }) {
    const getInitialStatus = () => {
        switch (prospek.lead_status) {
            case "Baru":
                return "Dihubungi";

            case "Dihubungi":
                return "Negosiasi";

            default:
                return "";
        }
    };

    const [status, setStatus] = useState(getInitialStatus());
    const [catatan, setCatatan] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const STATUS_OPTIONS = (() => {
        switch (prospek.lead_status) {
            case "Baru":
                return [
                    { value: "Dihubungi", label: "Dihubungi" },
                    { value: "Negosiasi", label: "Negosiasi" },
                ];

            case "Dihubungi":
                return [{ value: "Negosiasi", label: "Negosiasi" }];

            case "Negosiasi":
                return [];

            case "Deal":
            case "Belum Tertarik":
                return [];

            default:
                return [];
        }
    })();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Cegah jika status tidak berubah (sama seperti validasi di backend)
        if (status === prospek.lead_status) {
            setError("Status baru harus berbeda dari status saat ini.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `/api/prospek/${prospek.id}/status-logs`, // ✅ URL & method yang benar
                {
                    status_baru: status, // ✅ Field sesuai backend
                    catatan: catatan || null,
                },
            );

            alert("Status berhasil diperbarui.");
            onBack();
        } catch (err) {
            // Tangkap pesan error spesifik dari backend
            const msg =
                err.response?.data?.message ||
                err.response?.data?.errors?.status_baru?.[0] ||
                "Gagal memperbarui status.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Kembali
                </button>
                <h1 className="text-xl font-bold text-gray-900">
                    Update Status Prospek
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Nama Prospek */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Nama Prospek
                    </label>
                    <input
                        type="text"
                        value={prospek.nama_client || ""}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                </div>

                {/* Perusahaan */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Perusahaan
                    </label>
                    <input
                        type="text"
                        value={prospek.company_name || "-"}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                </div>

                {/* Status saat ini */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Status Saat Ini
                    </label>
                    <input
                        type="text"
                        value={prospek.lead_status || "-"}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                </div>

                {/* Status baru */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Status Baru <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={STATUS_OPTIONS.length === 0}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        {STATUS_OPTIONS.length > 0 ? (
                            STATUS_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))
                        ) : (
                            <option>Tidak ada status yang bisa dipilih</option>
                        )}
                    </select>
                </div>

                {/* Catatan (opsional) */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Catatan{" "}
                        <span className="text-gray-400 font-normal">
                            (opsional)
                        </span>
                    </label>
                    <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Tambahkan catatan perubahan status..."
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-[13px] text-red-600">
                        ⚠️ {error}
                    </div>
                )}

                {/* Tombol */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading || STATUS_OPTIONS.length === 0}
                        className="px-5 py-2.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 transition"
                    >
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
