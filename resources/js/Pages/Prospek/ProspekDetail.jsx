import React, { useState, useEffect } from "react";
import ModalTambahPengingat from "./ModalTambahPengingat";
import ModalTambahDeal from "./ModalTambahDeal";

const TABS = [
    { key: "info", label: "Informasi Umum" },
    { key: "komun", label: "Riwayat Komunikasi" },
    { key: "ingat", label: "Pengingat" },
    { key: "deal", label: "Deal Terkait" },
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
    };
    const { emoji, bg } = map[channel] ?? { emoji: "💬", bg: "bg-gray-400" };
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
        hour: "2-digit",
        minute: "2-digit",
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
            const res = await fetch(`/api/aktivitas/${prospekId}`, {
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            });
            if (!res.ok) throw new Error("Gagal memuat data.");
            const json = await res.json();
            setLogs(json.data ?? []);
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
                Riwayat Komunikasi
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
                                        {formatTanggal(log.contacted_at)}
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

            {/* ── Form tambah log ── */}
            <div className="pt-5 border-t border-gray-100">
                <p className="text-[13px] font-semibold text-gray-700 mb-3">
                    Tambah Catatan Komunikasi
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Pilih channel */}
                    <div className="flex gap-2">
                        {["WA", "Email", "Call"].map((ch) => (
                            <button
                                key={ch}
                                type="button"
                                onClick={() => setChannel(ch)}
                                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition ${
                                    channel === ch
                                        ? "bg-blue-700 text-white border-blue-700"
                                        : "border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600"
                                }`}
                            >
                                {ch === "WA"
                                    ? "💬 WhatsApp"
                                    : ch === "Email"
                                      ? "✉️ Email"
                                      : "📞 Telepon"}
                            </button>
                        ))}
                    </div>

                    {/* Textarea pesan */}
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-3 text-[14px] resize-none h-24 outline-none transition focus:ring-2 focus:ring-blue-50 ${
                            formError
                                ? "border-red-400 focus:border-red-400"
                                : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="Tulis catatan atau hasil komunikasi di sini..."
                    />

                    {/* Error form */}
                    {formError && (
                        <p className="text-[12px] text-red-500">{formError}</p>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg text-[13px] font-medium bg-blue-700 text-white hover:bg-blue-800 transition disabled:opacity-50"
                        >
                            {submitting ? "Menyimpan..." : "Simpan Catatan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────
export default function ProspekDetail({ prospek, onBack, onKonversi }) {
    const [tab, setTab] = useState("info");
    const [modalIngat, setModalIngat] = useState(false);
    const [modalDeal, setModalDeal] = useState(false);
    const [converted, setConverted] = useState(false);

    async function handleKonversi() {
        const konfirmasi = window.confirm(
            "Yakin ingin mengonversi prospek ini menjadi client?",
        );

        if (!konfirmasi) {
            return;
        }

        try {
            const res = await fetch(`/api/prospek/${prospek.id}/convert`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(
                    json.message || "Gagal mengonversi prospek menjadi client.",
                );
            }

            // Ubah status tombol menjadi "Sudah Jadi Client"
            setConverted(true);

            // Kirim data hasil konversi ke komponen induk
            if (onKonversi) {
                onKonversi(json.data);
            }

            // Pesan sukses
            alert("Prospek berhasil dikonversi menjadi client.");
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

                {!converted ? (
                    <button
                        onClick={handleKonversi}
                        className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium bg-green-700 text-white hover:bg-green-800 transition"
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Konversi ke Client
                    </button>
                ) : (
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
                )}
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
                                    [
                                        "Ditugaskan Kepada",
                                        prospek.sales?.first_name +
                                            " " +
                                            prospek.sales?.last_name,
                                    ],
                                    ["Tanggal Dibuat", prospek.created_at],
                                    ["Domisili", prospek.domisili],
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

                    {/* ── Pengingat ── */}
                    {tab === "ingat" && (
                        <div>
                            <p className="text-[12px] uppercase tracking-widest text-gray-400 font-semibold mb-5">
                                Pengingat Aktif
                            </p>
                            <div>
                                {[
                                    {
                                        title: "Kirim Proposal PDF",
                                        time: "Tenggat Waktu: 15:00 Hari Ini",
                                        urgent: true,
                                    },
                                    {
                                        title: "Konfirmasi Jadwal Demo",
                                        time: "Besok, 09:00",
                                        urgent: false,
                                    },
                                    {
                                        title: "Review SLA Kontrak",
                                        time: "18 Okt 2023",
                                        urgent: false,
                                    },
                                ].map((r, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0"
                                    >
                                        <div
                                            className="flex-shrink-0 cursor-pointer hover:border-blue-500 transition border-2 border-gray-300 rounded"
                                            style={{ width: 20, height: 20 }}
                                        />
                                        <div>
                                            <p className="text-[15px] font-medium text-gray-800">
                                                {r.title}
                                            </p>
                                            <p
                                                className={`text-[13px] mt-0.5 ${r.urgent ? "text-red-600 font-medium" : "text-gray-400"}`}
                                            >
                                                {r.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setModalIngat(true)}
                                className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-[14px] text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition"
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
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Tambah Pengingat Baru
                            </button>
                        </div>
                    )}

                    {/* ── Deal Terkait ── */}
                    {tab === "deal" && (
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-[15px] font-semibold text-gray-800">
                                    Peluang Aktif untuk {prospek.nama_client}
                                </p>
                                <button
                                    onClick={() => setModalDeal(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium bg-blue-700 text-white hover:bg-blue-800 transition"
                                >
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Tambah Deal
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {[
                                    {
                                        nama: "Paket Implementasi Software ERP",
                                        nilai: "Rp 150.000.000",
                                        status: "negosiasi",
                                        statusLabel: "Dalam Negosiasi",
                                        tgl: "Estimasi Closing: 25 Mei",
                                    },
                                    {
                                        nama: "Maintenance Server Tahunan",
                                        nilai: "Rp 45.000.000",
                                        status: "proposal",
                                        statusLabel: "Proposal Dikirim",
                                        tgl: "Estimasi Closing: 10 Juni",
                                    },
                                    {
                                        nama: "Training Karyawan (Batch 1)",
                                        nilai: "Rp 25.000.000",
                                        status: "berhasil",
                                        statusLabel: "Deal Berhasil",
                                        tgl: "Selesai: 20 April",
                                    },
                                ].map((d, i) => (
                                    <div
                                        key={i}
                                        className="border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition"
                                    >
                                        <div>
                                            <p className="text-[15px] font-medium text-gray-800">
                                                {d.nama}
                                            </p>
                                            <p className="text-[13px] text-gray-500 mt-0.5">
                                                {d.nilai}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[12px] font-medium ${DEAL_BADGE[d.status]}`}
                                            >
                                                {d.statusLabel}
                                            </span>
                                            <p className="text-[12px] text-gray-400 mt-1.5 flex items-center gap-1 justify-end">
                                                📅 {d.tgl}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ModalTambahPengingat
                show={modalIngat}
                onClose={() => setModalIngat(false)}
            />
            <ModalTambahDeal
                show={modalDeal}
                onClose={() => setModalDeal(false)}
            />
        </div>
    );
}
