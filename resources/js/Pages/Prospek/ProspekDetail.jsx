import React, { useState, useEffect } from "react";

const TABS = [
    { key: "info", label: "Informasi Umum" },
    { key: "komun", label: "Riwayat Komunikasi" },
];

const DEAL_BADGE = {
    negosiasi: "bg-amber-100 text-amber-700",
    proposal: "bg-blue-100 text-blue-700",
    berhasil: "bg-green-100 text-green-700",
};

// Icon per channel
function ChannelIcon({ channel }) {
    const map = {
        WA: { emoji: "💬", bg: "bg-green-500" },
        Email: { emoji: "✉️", bg: "bg-blue-500" },
        Call: { emoji: "📞", bg: "bg-purple-500" },
        Status: { emoji: "🔄", bg: "bg-amber-500" },
    };

    const { emoji, bg } = map[channel] ?? {
        emoji: "📌",
        bg: "bg-gray-400",
    };

    return (
        <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-sm ${bg}`}
        >
            {emoji}
        </div>
    );
}

// Format tanggal ke lokal Indonesia
function formatTanggal(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// ─── Tab Riwayat Komunikasi ───────────────────────────────────────────────────
function TabKomunikasi({ prospekId }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [channel, setChannel] = useState("WA");
    const [message, setMessage] = useState("");
    const [formError, setFormError] = useState(null);

    // Ambil log dari API
    async function fetchLogs() {
        setLoading(true);
        setError(null);

        try {
            // Ambil aktivitas komunikasi
            const aktivitasRes = await fetch(`/api/aktivitas/${prospekId}`, {
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            });

            // Ambil riwayat status
            const statusRes = await fetch(
                `/api/prospek/${prospekId}/status-logs`,
                {
                    headers: { Accept: "application/json" },
                    credentials: "same-origin",
                },
            );

            if (!aktivitasRes.ok || !statusRes.ok) {
                throw new Error("Gagal memuat riwayat.");
            }

            const aktivitasJson = await aktivitasRes.json();
            const statusJson = await statusRes.json();

            // Format aktivitas komunikasi
            const aktivitas = (aktivitasJson.data || []).map((item) => ({
                id: `aktivitas-${item.id}`,
                type: "aktivitas",
                channel: item.channel,
                message: item.message,
                sales_name: item.sales_name,
                created_at: item.contacted_at,
            }));

            // Format status log
            const statusLogs = (statusJson.data || []).map((item) => ({
                id: `status-${item.id}`,
                type: "status",
                channel: "Status",
                message:
                    `Status diubah dari "${item.status_lama}" ` +
                    `menjadi "${item.status_baru}"` +
                    (item.catatan ? `\nCatatan: ${item.catatan}` : ""),
                sales_name:
                    item.user?.name ||
                    item.user?.first_name + " " + item.user?.last_name ||
                    "-",
                created_at: item.created_at,
            }));

            // Gabungkan lalu urutkan terbaru
            const gabungan = [...aktivitas, ...statusLogs].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at),
            );

            setLogs(gabungan);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLogs();
    }, [prospekId]);

    // Kirim log baru
    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);

        if (!message.trim()) {
            setFormError("Isi pesan tidak boleh kosong.");
            return;
        }

        setSubmitting(true);
        try {
            // Ambil CSRF token dari cookie (Laravel Sanctum)
            const csrfToken = document.cookie
                .split("; ")
                .find((r) => r.startsWith("XSRF-TOKEN="))
                ?.split("=")[1];

            const res = await fetch("/api/aktivitas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": csrfToken
                        ? decodeURIComponent(csrfToken)
                        : "",
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    lead_client_id: prospekId,
                    channel,
                    message: message.trim(),
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                // Tangkap error validasi Laravel
                const firstError = json.errors
                    ? Object.values(json.errors)[0]?.[0]
                    : json.message;
                throw new Error(firstError ?? "Gagal menyimpan.");
            }

            // Tambah log baru ke atas list tanpa refetch
            setLogs((prev) => [json.data, ...prev]);
            setMessage("");
            setChannel("WA");
        } catch (e) {
            setFormError(e.message);
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <div>
            <p className="text-[12px] uppercase tracking-widest text-gray-400 font-semibold mb-5">
                Riwayat Aktivitas & Perubahan Status
            </p>

            {/* ── Timeline log ── */}
            {loading ? (
                <div className="flex items-center gap-2 text-[13px] text-gray-400 py-4">
                    <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        />
                    </svg>
                    Memuat riwayat komunikasi...
                </div>
            ) : error ? (
                <div className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
                    {error}{" "}
                    <button
                        onClick={fetchLogs}
                        className="underline text-red-600 font-medium"
                    >
                        Coba lagi
                    </button>
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-8 text-[13px] text-gray-400">
                    Belum ada riwayat komunikasi. Tambahkan catatan pertama di
                    bawah.
                </div>
            ) : (
                <div className="relative mb-6">
                    {logs.map((log, i) => (
                        <div key={log.id} className="flex gap-4 pb-5 relative">
                            {/* Garis vertikal timeline */}
                            {i < logs.length - 1 && (
                                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-100" />
                            )}
                            <ChannelIcon channel={log.channel} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-[12px] font-semibold text-gray-500">
                                        {log.channel}
                                    </span>
                                    <span className="text-gray-200">·</span>
                                    <span className="text-[12px] text-gray-400">
                                        {formatTanggal(log.created_at)}
                                    </span>
                                    {log.sales_name && (
                                        <>
                                            <span className="text-gray-200">
                                                ·
                                            </span>
                                            <span className="text-[12px] text-gray-400">
                                                oleh {log.sales_name}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-[14px] text-gray-600 leading-relaxed">
                                    {log.message}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function ProspekDetail({ prospek, onBack, onKonversi }) {
    const [tab, setTab] = useState(prospek.defaultTab || "info");
    const [modalIngat, setModalIngat] = useState(false);
    const [modalDeal, setModalDeal] = useState(false);
    const [converted, setConverted] = useState(false);

    async function handleKonversi() {
        const konfirmasi = window.confirm(
            "Yakin ingin mengonversi prospek ini menjadi client?",
        );

        if (!konfirmasi) return;

        try {
            const csrfToken = document.cookie
                .split("; ")
                .find((r) => r.startsWith("XSRF-TOKEN="))
                ?.split("=")[1];

            // simpan status log
            await fetch(`/api/prospek/${prospek.id}/status-logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": csrfToken
                        ? decodeURIComponent(csrfToken)
                        : "",
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    status_baru: "Deal",
                    catatan: "Prospek berhasil dikonversi menjadi client",
                }),
            });

            // convert client
            const res = await fetch(`/api/prospek/${prospek.id}/convert`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": csrfToken
                        ? decodeURIComponent(csrfToken)
                        : "",
                },
                credentials: "same-origin",
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(
                    json.message || "Gagal mengonversi prospek menjadi client.",
                );
            }

            setConverted(true);

            if (onKonversi) {
                onKonversi(json.data);
            }

            alert("Prospek berhasil dikonversi menjadi client.");

            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleTolak() {
        const konfirmasi = window.confirm("Yakin ingin menolak prospek ini?");

        if (!konfirmasi) return;

        try {
            const csrfToken = document.cookie
                .split("; ")
                .find((r) => r.startsWith("XSRF-TOKEN="))
                ?.split("=")[1];

            const res = await fetch(`/api/prospek/${prospek.id}/status-logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": csrfToken
                        ? decodeURIComponent(csrfToken)
                        : "",
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    status_baru: "Belum Tertarik",
                    catatan: "Pelanggan belum tertarik",
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Gagal mengubah status.");
            }

            alert("Prospek berhasil diubah menjadi Belum Tertarik.");

            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    }

    const STATUS_BADGE = {
        baru: "bg-blue-100 text-blue-700",
        dihubungi: "bg-purple-100 text-purple-700",
        negosiasi: "bg-amber-100 text-amber-700",
        berhasil: "bg-green-100 text-green-700",
        gagal: "bg-red-100 text-red-700",
    };

    const STATUS_LABEL = {
        baru: "Baru",
        dihubungi: "Dihubungi",
        negosiasi: "Negosiasi",
        berhasil: "Berhasil",
        gagal: "Gagal",
    };

    const TABS = [
        { key: "info", label: "Informasi Umum" },
        { key: "komun", label: "Riwayat Aktivitas" },
    ];

    // ─────────────────────────────────────────────────────────────
    // KOMPONEN TAB UPDATE STATUS
    // ─────────────────────────────────────────────────────────────

    function TabUpdateStatus({ prospek, onRefresh }) {
        const [status, setStatus] = useState(prospek.lead_status || "Baru");
        const [loading, setLoading] = useState(false);
        const [message, setMessage] = useState("");

        const STATUS_OPTIONS = [
            { value: "baru", label: "Baru" },
            { value: "dihubungi", label: "Dihubungi" },
            { value: "negosiasi", label: "Negosiasi" },
        ];

        async function handleSubmit(e) {
            e.preventDefault();
            setLoading(true);
            setMessage("");

            try {
                const res = await fetch(`/api/prospek/${prospek.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({
                        lead_status: status,
                    }),
                });

                const json = await res.json();

                if (!res.ok) {
                    throw new Error(
                        json.message || "Gagal memperbarui status prospek.",
                    );
                }

                setMessage("Status prospek berhasil diperbarui.");

                // Refresh data dari parent component
                if (onRefresh) {
                    onRefresh();
                }
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        }

        return (
            <div>
                <form onSubmit={handleSubmit} className="max-w-lg">
                    {/* Nama Prospek */}
                    <div className="mb-5">
                        <label className="block text-[13px] font-medium text-gray-600 mb-2">
                            Nama Prospek
                        </label>
                        <input
                            type="text"
                            value={prospek.nama_client || ""}
                            disabled
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"
                        />
                    </div>

                    {/* Status */}
                    <div className="mb-5">
                        <label className="block text-[13px] font-medium text-gray-600 mb-2">
                            Status Prospek
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {STATUS_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pesan */}
                    {message && (
                        <div className="mb-4 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
                            {message}
                        </div>
                    )}

                    {/* Tombol */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 transition"
                    >
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </form>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // TAMBAHKAN DI BAGIAN RENDER TAB
    // Letakkan di dalam <div className="p-7">
    // setelah tab "komun"
    // ─────────────────────────────────────────────────────────────

    {
        tab === "update" && (
            <TabUpdateStatus prospek={prospek} onRefresh={onBack} />
        );
    }

    return (
        <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl px-5 py-3">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[14px] font-medium text-blue-600 hover:text-blue-800 transition"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Kembali
                </button>
                <svg
                    className="w-4 h-4 text-gray-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
                <button
                    onClick={onBack}
                    className="text-[14px] font-medium text-blue-600 hover:text-blue-800 transition"
                >
                    Prospek
                </button>
                <svg
                    className="w-4 h-4 text-gray-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
                <span className="text-[14px] text-gray-500">
                    {prospek.nama_client}
                </span>
                <span className="ml-auto text-[12px] text-gray-400 font-mono">
                    #{prospek.id}
                </span>
            </div>

            {/* Header card */}
            <div className="bg-white rounded-xl border border-gray-200 px-7 py-6 mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[18px] font-bold flex-shrink-0">
                        {(prospek.nama_client || "?")
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h2 className="text-[20px] font-bold text-gray-900 leading-tight">
                                {prospek.nama_client}
                            </h2>
                            {prospek.lead_status && (
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-[12px] font-medium ${STATUS_BADGE[prospek.lead_status] ?? "bg-gray-100 text-gray-600"}`}
                                >
                                    {STATUS_LABEL[prospek.lead_status] ??
                                        prospek.lead_status}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[13px] text-gray-400 flex-wrap">
                            <span>{prospek.company_name || "-"}</span>
                            {prospek.sumber && (
                                <>
                                    <span className="text-gray-200">·</span>
                                    <span>{prospek.sumber}</span>
                                </>
                            )}
                            <span className="text-gray-200">·</span>
                            <span className="font-mono text-[12px]">
                                #{prospek.id}
                            </span>
                        </div>
                    </div>
                </div>

                {!converted && prospek.lead_status === "Negosiasi" ? (
                    <div className="flex items-center gap-2">
                        {/* Tombol Konversi */}
                        <button
                            onClick={handleKonversi}
                            className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium bg-green-700 text-white hover:bg-green-800 transition"
                        >
                            Konversi ke Client
                        </button>

                        {/* Tombol Tolak */}
                        <button
                            onClick={handleTolak}
                            className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            Belum Tertarik
                        </button>
                    </div>
                ) : converted ? (
                    <div className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium bg-white text-gray-400 border border-gray-200 cursor-not-allowed">
                        <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Sudah Jadi Client
                    </div>
                ) : null}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-6 py-3.5 text-[14px] whitespace-nowrap border-b-2 transition flex-shrink-0 ${
                                tab === t.key
                                    ? "text-blue-700 border-blue-700 font-semibold"
                                    : "text-gray-500 border-transparent hover:text-blue-600"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="p-7">
                    {/* ── Informasi Umum ── */}
                    {tab === "info" && (
                        <div>
                            <p className="text-[12px] uppercase tracking-widest text-gray-400 font-semibold mb-6">
                                Informasi Detail Lead
                            </p>
                            <div className="grid grid-cols-2 gap-x-10 gap-y-7">
                                {[
                                    ["Nama Kontak", prospek.nama_client],
                                    ["Perusahaan", prospek.company_name],
                                    ["Email", prospek.email, true],
                                    ["Telepon", prospek.phone],
                                    ["Produk Diminati", prospek.product_interest],
                                    [
                                        "Ditugaskan Kepada",
                                        prospek.sales?.first_name +
                                            " " +
                                            prospek.sales?.last_name,
                                    ],
                                    [
                                        "Tanggal Dibuat",
                                        new Date(
                                            prospek.created_at,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }),
                                    ],
                                    ["Domisili", prospek.domisili],
                                    ["Alamat Lengkap", prospek.alamat_lengkap],
                                ].map(([label, val, isEmail]) => (
                                    <div
                                        key={label}
                                        className="flex flex-col gap-1.5"
                                    >
                                        <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold">
                                            {label}
                                        </p>
                                        {isEmail ? (
                                            <a
                                                href={`mailto:${val}`}
                                                className="text-[15px] text-blue-600 font-medium hover:underline"
                                            >
                                                {val}
                                            </a>
                                        ) : (
                                            <p className="text-[15px] font-semibold text-gray-800">
                                                {val || "-"}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-[12px] uppercase tracking-widest text-gray-400 font-semibold mb-4">
                                    Informasi Tambahan
                                </p>
                                <div className="grid grid-cols-2 gap-x-10 gap-y-7">
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold">
                                            Sumber Lead
                                        </p>
                                        <p className="text-[15px] font-semibold text-gray-800">
                                            {prospek.sumber || "-"}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold">
                                            Status
                                        </p>
                                        <p className="text-[15px] font-semibold text-gray-800 capitalize">
                                            {prospek.lead_status || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Riwayat Komunikasi ── (komponen terpisah) */}
                    {tab === "komun" && (
                        <TabKomunikasi prospekId={prospek.id} />
                    )}
                </div>
            </div>
        </div>
    );
}
